import { IGetStarknetWallet } from "./types";
import { IStarknetWindowObject } from "./wallet/types";
import discovery from "./discovery";
import defaultWallet from "./configs/defaultWallet";
import show from "./modal";
import { filterPreAuthorized, shuffle } from "./utils";

class GetStarknetWallet implements IGetStarknetWallet {
    walletObjRef: { current?: IStarknetWindowObject } = {};

    async connect(options?: {
        order?: string[] | "community" | "random";
        include?: string[];
        exclude?: string[];
        showList?: boolean;
    }): Promise<IStarknetWindowObject | undefined> {
        const isConnected = this.#isConnected();
        console.log("connect", { isConnected, options });

        const discoveryWallets = [...discovery];
        console.log("discovery wallets", discoveryWallets);

        let installedWallets = [...(window.starknet_wallets ?? [])];
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
            installedWallets.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

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
            return show(
                installedWallets,
                discoveryWallets,
                await filterPreAuthorized(installedWallets)
            );
        }

        const defaultWalletId = defaultWallet.get();
        const defaultWalletObj = installedWallets.find(w => w.id === defaultWalletId);
        if (defaultWalletObj) {
            return defaultWalletObj;
        }

        const preAuthorizedWallets = await filterPreAuthorized(installedWallets);
        if (preAuthorizedWallets.length === 1) {
            return preAuthorizedWallets[0];
        }

        return show(installedWallets, discoveryWallets, preAuthorizedWallets);
    }

    disconnect(): boolean {
        const isConnected = this.#isConnected();
        this.walletObjRef.current = undefined;
        // disconnected successfully if was connected before
        return isConnected;
    }

    getStarknet(): IStarknetWindowObject | undefined {
        return this.walletObjRef.current;
    }

    #isConnected(): boolean {
        return !!this.walletObjRef.current;
    }
}

window.starknet_wallets = [];
const gsw = new GetStarknetWallet();
export default gsw;
