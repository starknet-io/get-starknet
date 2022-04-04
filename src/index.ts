import type {
    GetStarknetWalletOptions,
    IGetStarknetWallet,
    IStarknetWindowObject,
} from "./types";
import defaultWallet from "./configs/defaultWallet";
import lastWallet from "./configs/lastConnected";
import show from "./modal";
import { filterPreAuthorized, shuffle } from "./utils";
import { Account, defaultProvider, KeyPair } from "starknet";

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
            new (class implements IStarknetWindowObject {
                id = "disconnected";
                name = "Disconnected";
                icon = "";
                selectedAddress = undefined;
                provider = defaultProvider;
                isConnected = false;
                account = new Account(defaultProvider, "", {} as KeyPair);
                version = "";

                enable(options: { showModal?: boolean } | undefined): Promise<string[]> {
                    return self.connect().then(wallet => wallet?.enable(options) ?? []);
                }

                isPreauthorized = async () => false;
                off = () => {};
                on = () => {
                    throw new Error("can't register event on disconnected wallet");
                };
                request = () => {
                    throw new Error("can't request a disconnected wallet");
                };
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

        let installed = Object.keys(window).reduce<IStarknetWindowObject[]>(
            (wallets, key) => {
                if (key.startsWith("starknet")) {
                    wallets.push((window as { [key: string]: any })[key]);
                }
                return wallets;
            },
            []
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

export const gsw = new GetStarknetWallet();
export * from "./types";
