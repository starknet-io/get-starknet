import type { GetStarknetWalletOptions, IStarknetWindowObject } from "./types";
export declare const getStarknet: (resetAuthorizations?: boolean | undefined) => IStarknetWindowObject;
export declare const connect: (options?: GetStarknetWalletOptions | undefined) => Promise<IStarknetWindowObject | undefined>;
export declare const disconnect: (resetAuthorizations?: boolean | undefined) => boolean;
export * from "./types";
