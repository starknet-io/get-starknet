/**
 * @see https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/generateUniqueID.ts
 */
import type { IStarknetWindowObject } from "./wallet/types";

export const generateUID = () =>
    `${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;

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
