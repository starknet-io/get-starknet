import type { IStarknetWindowObject } from "./types";
import discovery from "./discovery";

export const shuffle = (arr: any[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

/**
 * filters given wallets array, return only preAuthorized instances
 * @param wallets
 */
export const filterPreAuthorized = (
    wallets: IStarknetWindowObject[]
): Promise<IStarknetWindowObject[]> =>
    Promise.all(
        wallets.map(w =>
            w
                .isPreauthorized()
                .then(authorized => (authorized ? w : undefined))
                .catch(() => undefined)
        )
    ).then(result => result.filter(res => !!res) as IStarknetWindowObject[]);

export const isWalletObj = (key: string, wallet: any): boolean => {
    try {
        if (
            wallet &&
            [
                // wallet's must have methods/members, see IStarknetWindowObject
                "request",
                "isConnected",
                "provider",
                "enable",
                "isPreauthorized",
                "on",
                "off",
                "version",
            ].every(key => key in wallet)
        ) {
            if (key === "starknet" && (!wallet.id || !wallet.name || !wallet.icon)) {
                try {
                    // attempt to add missing metadata to legacy wallet
                    // object (enriched from wallets-discovery list)
                    const argentDiscovery = discovery.find(dw => dw.id === "argentX");
                    if (argentDiscovery) {
                        wallet.id = argentDiscovery.id;
                        wallet.name = argentDiscovery.name;
                        wallet.icon = argentDiscovery.icon;
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            // test for new fields only after attempting
            // to enrich the legacy wallet ->
            return ["id", "name", "icon"].every(key => key in wallet);
        }
    } catch (err) {}
    return false;
};
