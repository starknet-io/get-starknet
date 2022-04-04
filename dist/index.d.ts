import type { GetStarknetWalletOptions, IGetStarknetWallet, IStarknetWindowObject } from "./types";
declare class GetStarknetWallet implements IGetStarknetWallet {
    #private;
    connect(options?: GetStarknetWalletOptions): Promise<IStarknetWindowObject | undefined>;
    disconnect(): boolean;
    getStarknet(): IStarknetWindowObject;
}
export declare const gsw: GetStarknetWallet;
export * from "./types";
