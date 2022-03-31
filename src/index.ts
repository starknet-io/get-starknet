import { IGetStarknetWallet } from "./types";
import { IStarknetWindowObject } from "./wallet/types";
import discovery from "./discovery";
import defaultWallet from "./configs/defaultWallet";
import show from "./modal";
import { filterPreAuthorized, shuffle } from "./utils";
import { defaultProvider } from "starknet";
import packageInfo from "../package.json";

class GetStarknetWallet implements IGetStarknetWallet {
    walletObjRef: { current?: IStarknetWindowObject } = {};

    async connect(options?: {
        order?: string[] | "community" | "random";
        include?: string[];
        exclude?: string[];
        showList?: boolean;
    }): Promise<IStarknetWindowObject | undefined> {
        try {
            const isConnected = this.#isConnected();
            console.log("connect", { isConnected, options });

            const discoveryWallets = [...discovery];
            console.log("discovery wallets", discoveryWallets);

            let installedWallets = [...(window.starknet_wallets ?? [])];

            const legacyWallet = window.starknet;
            if (
                legacyWallet &&
                !installedWallets.includes(legacyWallet) &&
                (!legacyWallet.id ||
                    !installedWallets.some(w => w.id === legacyWallet.id))
            ) {
                installedWallets.push(legacyWallet);
            }

            console.log("pre options available wallets", installedWallets);

            if (options?.include?.length) {
                const included = new Set<string>(options.include);
                installedWallets = installedWallets.filter(w => included.has(w.id));
            }

            if (options?.exclude?.length) {
                const excluded = new Set<string>(options.exclude);
                installedWallets = installedWallets.filter(w => !excluded.has(w.id));
            }

            if (!options?.order || options.order === "random") {
                shuffle(installedWallets);
            } else if (Array.isArray(options.order)) {
                // sort by order
                const order = [...options.order];
                installedWallets.sort(
                    (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
                );

                const orderScope = installedWallets.length - order.length;
                installedWallets = [
                    ...installedWallets.slice(orderScope),
                    // shuffle wallets which are outside `order` scope
                    ...shuffle(installedWallets.slice(0, orderScope)),
                ];
            } else if (options.order === "community") {
                // "community" order is the natural order of the wallets array,
                // see discovery/index.ts
            }

            console.log("post options available wallets", installedWallets);

            // force showing the popup if we are called while connected,
            // or when we were explicitly told to show it
            if (isConnected || options?.showList) {
                const preAuthorized = await filterPreAuthorized(installedWallets);
                const wallet = await show(
                    installedWallets,
                    discoveryWallets,
                    preAuthorized
                );
                return this.#setCurrentWallet(wallet);
            }

            const defaultWalletId = defaultWallet.get();
            const defaultWalletObj = installedWallets.find(w => w.id === defaultWalletId);
            if (defaultWalletObj) {
                return this.#setCurrentWallet(defaultWalletObj);
            }

            const preAuthorizedWallets = await filterPreAuthorized(installedWallets);
            if (preAuthorizedWallets.length === 1) {
                return preAuthorizedWallets[0];
            }

            const wallet = await show(
                installedWallets,
                discoveryWallets,
                preAuthorizedWallets
            );
            return this.#setCurrentWallet(wallet);
        } catch (err) {
            console.error(err);
        }
        return undefined;
    }

    disconnect(): boolean {
        const isConnected = this.#isConnected();
        this.walletObjRef.current = undefined;
        // disconnected successfully if was connected before
        return isConnected;
    }

    getStarknet(): IStarknetWindowObject {
        const self = this;

        return (
            this.walletObjRef.current ??
            new (class implements IStarknetWindowObject {
                id = "disconnected";
                name = "Disconnected";
                icon = "";
                selectedAddress = undefined;
                provider = defaultProvider;
                isConnected = false;
                account = undefined;
                version = packageInfo.version;

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
        return !!this.walletObjRef.current;
    }

    #setCurrentWallet(wallet: IStarknetWindowObject | undefined) {
        this.walletObjRef.current = wallet;
        return wallet;
    }
}

const gsw = new GetStarknetWallet();
export default gsw;
