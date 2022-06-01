import type {
    DisconnectOptions,
    EventHandler,
    EventType,
    GetStarknetWalletOptions,
    IGetStarknetWallet,
    IStarknetWindowObject,
} from "./types";
import defaultWallet from "./configs/defaultWallet";
import lastWallet from "./configs/lastConnected";
import show from "./modal";
import { filterBy, filterPreAuthorized, isWalletObj, shuffle, sortBy } from "./utils";
import {
    Account,
    AccountInterface,
    defaultProvider,
    KeyPair,
    SignerInterface,
} from "starknet";

class GetStarknetWallet implements IGetStarknetWallet {
    #walletObjRef: { current?: IStarknetWindowObject } = {};

    connect = async (
        options?: GetStarknetWalletOptions
    ): Promise<IStarknetWindowObject | undefined> => {
        try {
            this.#declare();

            const connected = this.#isConnected();
            console.log("connect", { connected });

            const {
                installed: installedWallets,
                preAuthorized,
                defaultWallet,
                lastWallet,
            } = await this.#getInstalledWallets(options);

            // explicitly attempting to connect without showing the list,
            // return first preAuthorized wallet (if any);
            // note: preAuthorized wallets - at this point - are already
            // ordered by -
            // 0. defaultWallet
            // 1. lastWallet
            // 2-n. others (shuffled)
            if (options?.showList === false) {
                const wallet = preAuthorized[0];
                // do not override `lastWallet` state if its associated wallet
                // is not preAuthorized (i.e. user could choose a wallet, but
                // not necessarily approve it for connection)
                console.log(`silent connect requested -> wallet: ${wallet?.id}`);
                return wallet ? this.#setCurrentWallet(wallet) : undefined;
            }

            // force showing the popup if
            // 1. we are called while connected
            // 2. we were explicitly told to show it
            // 3. user never selected from the popup
            const forcePopup = connected || options?.showList || !lastWallet;
            if (!forcePopup) {
                // return user-set default wallet if available
                for (const stateWallet of [
                    // 1st priority is user-set-default wallet
                    defaultWallet,
                    // 2nd priority is user-last-selected wallet
                    lastWallet,
                ] as IStarknetWindowObject[]) {
                    if (stateWallet) {
                        return this.#setCurrentWallet(stateWallet);
                    }
                }

                // no state-wallet but only one wallet - returning that wallet
                if (installedWallets.length === 1) {
                    return this.#setCurrentWallet(installedWallets[0]);
                }
            }

            // show popup
            const wallet = await show(installedWallets, options);
            return this.#setCurrentWallet(wallet);
        } catch (err) {
            console.error(err);
        }
        return undefined;
    };

    constructor() {
        this.#declare();
    }

    disconnect = (options?: DisconnectOptions): boolean => {
        this.#declare();

        const connected = this.#isConnected();
        this.#walletObjRef.current = undefined;

        if (options?.clearLastWallet) lastWallet.delete();
        if (options?.clearDefaultWallet) defaultWallet.delete();

        // disconnected successfully if was connected before
        return connected;
    };

    getStarknet = (): IStarknetWindowObject => {
        this.#declare();
        const self = this;

        return (
            this.#walletObjRef.current ??
            // create a wrapper
            new (class implements IStarknetWindowObject {
                // default values
                id = "disconnected";
                name = "Disconnected";
                icon = "";
                selectedAddress?: string = undefined;
                provider = defaultProvider;
                isConnected = false;
                account: AccountInterface = new Account(
                    defaultProvider,
                    "",
                    {} as KeyPair
                );
                version = "";
                signer?: SignerInterface = undefined;

                /**
                 * stores pre-enabled wallet `on` calls' listeners
                 * @private
                 */
                #callbacks: { [key: string]: EventHandler[] } = {};

                /**
                 * attempt to read a chosen wallet before calling `connect`
                 * ourselves; a valid chosen wallet will be presented when
                 * the user holds a reference to getStarknet()'s returned
                 * wallet-wrapper object, and keep accessing it even after
                 * connecting a wallet successfully
                 * @param options
                 */
                enable = async (options?: { showModal?: boolean }): Promise<string[]> => {
                    try {
                        const wallet = await this.#connect({
                            showList: options?.showModal,
                        });
                        if (wallet) {
                            const result = await wallet.enable();
                            this.#refreshWalletProperties(wallet);
                            return result;
                        }
                    } catch (err) {
                        console.error(err);
                    }
                    return [];
                };

                /**
                 * @return true when there is at least 1 pre-authorized wallet
                 */
                isPreauthorized = () =>
                    self.#isConnected()
                        ? (
                              self.#walletObjRef.current as IStarknetWindowObject
                          ).isPreauthorized()
                        : self
                              .#getInstalledWallets()
                              .then(result => !!result.preAuthorized.length);

                off = (event: EventType, handleEvent: EventHandler) => {
                    if (self.#isConnected()) {
                        self.#walletObjRef.current?.off(event, handleEvent);
                    } else {
                        if (this.#callbacks[event]) {
                            this.#callbacks[event] = this.#callbacks[event].filter(
                                callback => callback !== handleEvent
                            );
                        }
                    }
                };

                on = (event: EventType, handleEvent: EventHandler) => {
                    if (self.#isConnected()) {
                        self.#walletObjRef.current?.on(event, handleEvent);
                    } else {
                        const listeners =
                            this.#callbacks[event] ?? (this.#callbacks[event] = []);
                        if (!listeners.includes(handleEvent)) {
                            listeners.push(handleEvent);
                        }
                    }
                };

                /**
                 * request on chosen-wallet, in case the user still uses the
                 * wrapping object returned from getStarknet();
                 * see `enable` comment for understanding when this could happen
                 *
                 * we shouldn't "connect" implicitly for a non-`enable`-called
                 * wallet (e.g. wallet won't let you `request` before you called
                 * `enable`)
                 * @param call
                 */
                request = async (call: any) => {
                    const currentWallet = self.#walletObjRef.current;
                    if (!currentWallet) {
                        throw new Error("can't request a disconnected wallet");
                    }
                    return currentWallet.request(call);
                };

                #connect = (options?: GetStarknetWalletOptions) =>
                    (self.#walletObjRef.current
                        ? Promise.resolve(self.#walletObjRef.current)
                        : self.connect(options)
                    ).then(wallet => {
                        if (wallet) {
                            // assign wallet data to the wallet-wrapper instance
                            // in case the user holds it and call it directly
                            // instead of getting a fresh reference each time
                            // via gsw.getStarknet()
                            this.id = wallet.id;
                            this.name = wallet.name;
                            this.icon = wallet.icon;
                            this.version = wallet.version;
                            this.#refreshWalletProperties(wallet);

                            // register pre-connect callbacks on target wallet
                            Object.entries(this.#callbacks).forEach(([event, handlers]) =>
                                handlers.forEach(h => wallet.on(event as EventType, h))
                            );
                            // then clear callbacks
                            this.#callbacks = {};
                        }
                        return wallet;
                    });

                #refreshWalletProperties = (
                    wallet: IStarknetWindowObject | undefined
                ) => {
                    if (!wallet) return;
                    this.selectedAddress = wallet.selectedAddress;
                    this.provider = wallet.provider;
                    this.isConnected = wallet.isConnected;
                    this.account = wallet.account;
                    this.signer = wallet.signer;
                };
            })()
        );
    };

    getInstalledWallets(
        options?: Omit<GetStarknetWalletOptions, "showList" | "modalOptions">
    ): Promise<IStarknetWindowObject[]> {
        return this.#getInstalledWallets(options).then(res => res.installed);
    }

    #isConnected(): boolean {
        return !!this.#walletObjRef.current;
    }

    #setCurrentWallet = (wallet: IStarknetWindowObject | undefined) => {
        this.#walletObjRef.current = wallet;
        if (wallet) {
            lastWallet.set(wallet.id);
        }
        return wallet;
    };

    #getInstalledWallets = async (
        options?: Omit<GetStarknetWalletOptions, "showList" | "modalOptions">
    ) => {
        await this.#waitForDocumentReady();

        console.log("getInstalledWallets -> options", options);

        // lookup installed wallets
        const installed = Object.values(
            Object.getOwnPropertyNames(window).reduce<
                Record<string, IStarknetWindowObject>
            >((wallets, key) => {
                if (key.startsWith("starknet")) {
                    const wallet = (window as Record<string, any>)[key];
                    if (isWalletObj(key, wallet) && !wallets[wallet.id]) {
                        wallets[wallet.id] = wallet;
                    }
                }
                return wallets;
            }, {})
        );

        // 1. lookup state wallets
        // 2. remove state-set wallets if they aren't available anymore
        const defaultWalletObj = installed.find(w => w.id === defaultWallet.get());
        if (!defaultWalletObj) defaultWallet.delete();
        const lastWalletObj = installed.find(w => w.id === lastWallet.get());
        if (!lastWalletObj) lastWallet.delete();

        // fetch & shuffle all preAuthorized
        const preAuthorized: IStarknetWindowObject[] = shuffle(
            await filterPreAuthorized(installed)
        );

        /**
         * prioritize states wallets at given arr
         */
        const prioritizeStateWallets = (arr: IStarknetWindowObject[]) => {
            // iterate last->first priorities since we push state-wallet at top
            [lastWalletObj, defaultWalletObj].forEach(stateWallet => {
                if (stateWallet) {
                    const filtered = arr.filter(w => w.id !== stateWallet.id);
                    const stateWalletPopped = filtered.length !== arr.length;
                    if (stateWalletPopped) {
                        arr = [stateWallet, ...filtered];
                    }
                }
            });
            return arr;
        };

        const result = {
            installed: prioritizeStateWallets(installed),
            preAuthorized: prioritizeStateWallets(preAuthorized),
            defaultWallet: defaultWalletObj,
            lastWallet: lastWalletObj,
        };

        console.log("pre options available wallets", result);

        result.installed = filterBy<IStarknetWindowObject>(result.installed, options);

        result.installed = sortBy<IStarknetWindowObject>(
            result.installed,
            options?.order
        );

        const isFixedOrder = options && Array.isArray(options.order);
        if (!isFixedOrder) {
            // 1. prioritize preAuthorized wallets:
            // remove preAuthorized wallets from installed wallets list
            const preAuthorizedIds = new Set<string>(preAuthorized.map(pa => pa.id));
            console.log("preAuthorizedIds", preAuthorizedIds);
            result.installed = result.installed.filter(w => !preAuthorizedIds.has(w.id));
            // put preAuthorized wallets first
            result.installed = [...preAuthorized, ...result.installed];

            // 2. prioritize states wallets:
            result.installed = prioritizeStateWallets(result.installed);
        }

        console.log("post options available wallets", result);
        return result;
    };

    #waitForDocumentReady = () => {
        console.log("#waitForDocumentReady called");
        const isReady = () => {
            const readyState = document.readyState;
            console.log("waitForDocumentReady readyState", readyState);
            return readyState === "complete";
        };

        return new Promise<void>(resolve => {
            if (isReady()) {
                resolve();
            } else {
                const id = setInterval(() => {
                    if (isReady()) {
                        clearInterval(id);
                        resolve();
                    }
                }, 50);
            }
        });
    };

    #declare = () => {
        if (typeof window !== "undefined") {
            window.gsw = true;
        }
    };
}

const gsw = new GetStarknetWallet();
export const getStarknet = gsw.getStarknet;
export const connect = gsw.connect;
export const disconnect = gsw.disconnect;
export const getInstalledWallets = gsw.getInstalledWallets;

export * from "./types";
