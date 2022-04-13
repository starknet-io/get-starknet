import type {
    EventHandler,
    EventType,
    GetStarknetWalletOptions,
    IGetStarknetWallet,
    IStarknetWindowObject,
} from "./types";
import defaultWallet from "./configs/defaultWallet";
import lastWallet from "./configs/lastConnected";
import show from "./modal";
import { filterPreAuthorized, isWalletObj, shuffle } from "./utils";
import {
    Account,
    AccountInterface,
    defaultProvider,
    KeyPair,
    SignerInterface,
} from "starknet";

class GetStarknetWallet implements IGetStarknetWallet {
    #walletObjRef: { current?: IStarknetWindowObject } = {};

    async connect(
        options?: GetStarknetWalletOptions
    ): Promise<IStarknetWindowObject | undefined> {
        try {
            const connected = this.#isConnected();
            console.log("connect", { connected });

            const installedWallets = await this.#getInstalledWallets(options);

            // force showing the popup if
            // 1. we are called while connected
            // 2. we were explicitly told to show it
            // 3. user never selected from the popup
            const forcePopup = connected || options?.showList || !lastWallet.get();
            if (!forcePopup) {
                // return user-set default wallet if available
                const defaultWalletId = defaultWallet.get();
                const defaultWalletObj = installedWallets.find(
                    w => w.id === defaultWalletId
                );
                if (defaultWalletObj) {
                    return this.#setCurrentWallet(defaultWalletObj);
                } else {
                    // remove prev-default wallet if not available anymore
                    defaultWallet.delete();
                }

                // no default but only one wallet - return that wallet
                if (installedWallets.length === 1) {
                    return this.#setCurrentWallet(installedWallets[0]);
                }
            }

            const wallet = await show(installedWallets);
            return this.#setCurrentWallet(wallet);
        } catch (err) {
            console.error(err);
        }
        return undefined;
    }

    constructor() {
        window.gsw = true;
        this.disconnect = this.disconnect.bind(this);
        this.connect = this.connect.bind(this);
        this.getStarknet = this.getStarknet.bind(this);
    }

    disconnect(): boolean {
        const connected = this.#isConnected();
        this.#walletObjRef.current = undefined;
        // disconnected successfully if was connected before
        return connected;
    }

    getStarknet(): IStarknetWindowObject {
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
                enable = (
                    options: { showModal?: boolean } | undefined
                ): Promise<string[]> =>
                    this.#connect().then(wallet => wallet?.enable(options) ?? []);

                /**
                 * @return true when there is at least 1 pre-authorized wallet
                 */
                isPreauthorized = async () =>
                    self.#isConnected()
                        ? (
                              self.#walletObjRef.current as IStarknetWindowObject
                          ).isPreauthorized()
                        : self
                              .#getInstalledWallets()
                              .then(installed => filterPreAuthorized(installed))
                              .then(preAuthorized => !!preAuthorized.length);

                off = (event: EventType, handleEvent: EventHandler) => {
                    if (self.#isConnected()) {
                        self.#walletObjRef.current?.on(event, handleEvent);
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
                        self.#walletObjRef.current?.off(event, handleEvent);
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
                    if (!self.#isConnected()) {
                        throw new Error("can't request a disconnected wallet");
                    }
                    return self.#walletObjRef.current?.request(call);
                };

                #connect = () =>
                    (self.#walletObjRef.current
                        ? Promise.resolve(self.#walletObjRef.current)
                        : self.connect()
                    ).then(wallet => {
                        if (wallet) {
                            // assign wallet data to the wallet-wrapper instance
                            // in case the user holds it and call it directly
                            // instead of getting a fresh reference each time
                            // via gsw.getStarknet()
                            this.id = wallet.id;
                            this.name = wallet.name;
                            this.icon = wallet.icon;
                            this.selectedAddress = wallet.selectedAddress;
                            this.provider = wallet.provider;
                            this.isConnected = wallet.isConnected;
                            this.account = wallet.account;
                            this.version = wallet.version;
                            this.signer = wallet.signer;

                            // register pre-connect callbacks on target wallet
                            Object.entries(this.#callbacks).forEach(([event, handlers]) =>
                                handlers.forEach(h => wallet.on(event as EventType, h))
                            );
                            // then clear callbacks
                            this.#callbacks = {};
                        }
                        return wallet;
                    });
            })()
        );
    }

    #isConnected(): boolean {
        return !!this.#walletObjRef.current;
    }

    #setCurrentWallet(wallet: IStarknetWindowObject | undefined) {
        this.#walletObjRef.current = wallet;
        if (wallet) {
            lastWallet.set(wallet.id);
        }
        return wallet;
    }

    async #getInstalledWallets(options?: Omit<GetStarknetWalletOptions, "showList">) {
        console.log("getInstalledWallets -> options", options);

        let installed = Object.values(
            Object.keys(window).reduce<{
                [key: string]: IStarknetWindowObject;
            }>((wallets, key) => {
                if (key.startsWith("starknet")) {
                    const wallet = (window as { [key: string]: any })[key];
                    if (isWalletObj(key, wallet) && !wallets[wallet.id]) {
                        wallets[wallet.id] = wallet;
                    }
                }
                return wallets;
            }, {})
        );

        console.log("pre options available wallets", installed);

        if (options?.include?.length) {
            const included = new Set<string>(options.include);
            installed = installed.filter(w => included.has(w.id));
        }

        if (options?.exclude?.length) {
            const excluded = new Set<string>(options.exclude);
            installed = installed.filter(w => !excluded.has(w.id));
        }

        if (options && Array.isArray(options.order)) {
            // skip default/preAuthorized priorities,
            // sort by client-specific order
            const order = [...options.order];
            installed.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

            const orderScope = installed.length - order.length;
            installed = [
                ...installed.slice(orderScope),
                // shuffle wallets which are outside `order` scope
                ...shuffle(installed.slice(0, orderScope)),
            ];
        } else {
            if (!options?.order || options.order === "random") {
                shuffle(installed);
            } else if (options?.order === "community") {
                // "community" order is the natural order of the wallets array,
                // see discovery/index.ts
            }

            // if we have more than a single installed wallet we'll
            // need to prioritize default & preAuthorized wallets
            if (installed.length > 1) {
                // fetch & shuffle all preAuthorized
                const preAuthorized = shuffle(await filterPreAuthorized(installed));

                // remove preAuthorized wallets from installed wallets list
                const preAuthorizedIds = new Set<string>(preAuthorized.map(pa => pa.id));
                console.log("preAuthorizedIds", preAuthorizedIds);
                installed = installed.filter(w => !preAuthorizedIds.has(w.id));

                // put preAuthorized wallets first
                installed = [...preAuthorized, ...installed];

                // lookup default wallet
                const defaultWalletId = defaultWallet.get();
                if (defaultWalletId) {
                    // pop defaultWalletObj from installed
                    let defaultWalletObj: IStarknetWindowObject | undefined = undefined;
                    installed = installed.filter(w => {
                        if (w.id === defaultWalletId) {
                            defaultWalletObj = w;
                            return false;
                        }
                        return true;
                    });

                    // and push it at the top
                    if (defaultWalletObj) {
                        installed.unshift(defaultWalletObj);
                    } else {
                        // remove prev-default wallet if not available anymore
                        defaultWallet.delete();
                    }
                }
            }
        }

        console.log("post options available wallets", installed);
        return installed;
    }
}

const gsw = new GetStarknetWallet();
export const getStarknet = gsw.getStarknet;
export const connect = gsw.connect;
export const disconnect = gsw.disconnect;

export * from "./types";
