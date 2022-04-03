/**
 * @see https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/generateUniqueID.ts
 */
import { IStarknetWindowObject } from "./wallet/types";
export declare const generateUID: () => string;
export declare const shuffle: (arr: any[]) => any[];
/**
 * filters given wallets array, return only preAuthorized instances
 * @param wallets
 */
export declare const filterPreAuthorized: (wallets: IStarknetWindowObject[]) => Promise<IStarknetWindowObject[]>;
