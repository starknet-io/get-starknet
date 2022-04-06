import type { IStarknetWindowObject } from "./types";
/**
 * @see https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/generateUniqueID.ts
 */
export declare const generateUID: () => string;
export declare const shuffle: (arr: any[]) => any[];
/**
 * filters given wallets array, return only preAuthorized instances
 * @param wallets
 */
export declare const filterPreAuthorized: (wallets: IStarknetWindowObject[]) => Promise<IStarknetWindowObject[]>;
export declare const isWalletObj: (key: string, wallet: any) => boolean;
