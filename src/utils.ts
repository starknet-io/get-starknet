import type {
    GetStarknetWalletOptions,
    IStarknetWindowObject,
    Order,
    WalletProvider,
} from "./types";
import discovery from "./discovery";

/**
 * @see https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/generateUniqueID.ts
 */
export const generateUID = () =>
    `${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;

export const shuffle = <T extends any[]>(arr: T): T => {
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

export const sortBy = <T extends IStarknetWindowObject | WalletProvider>(
    wallets: T[],
    order: Order
): T[] => {
    if (order && Array.isArray(order)) {
        // skip default/preAuthorized priorities,
        // sort by client-specific order
        wallets.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

        const orderScope = wallets.length - order.length;
        return [
            ...wallets.slice(orderScope),
            // shuffle wallets which are outside `order` scope
            ...shuffle(wallets.slice(0, orderScope)),
        ];
    } else {
        if (!order || order === "random") {
            return shuffle(wallets);
        } else if (order === "community") {
            // "community" order is the natural order of the wallets array,
            // see discovery/index.ts
        }
        return wallets;
    }
};

export function filterBy<T extends IStarknetWindowObject | WalletProvider>(
    installed: T[],
    options?: Omit<GetStarknetWalletOptions, "showList">
): T[] {
    if (options?.include?.length) {
        const included = new Set<string>(options.include);
        return installed.filter(w => included.has(w.id));
    }

    if (options?.exclude?.length) {
        const excluded = new Set<string>(options.exclude);
        return installed.filter(w => !excluded.has(w.id));
    }

    return installed;
}
