import type { GetStarknetWalletOptions, IStarknetWindowObject } from "./types";
export declare const getStarknet: () => IStarknetWindowObject;
export declare const connect: (options?: GetStarknetWalletOptions | undefined) => Promise<IStarknetWindowObject | undefined>;
export declare const disconnect: (resetLastWallet?: boolean | undefined) => boolean;
export * from "./types";
