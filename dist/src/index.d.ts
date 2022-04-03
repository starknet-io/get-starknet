import { IGetStarknetWallet } from "./types";
import { IStarknetWindowObject } from "./wallet/types";
declare class GetStarknetWallet implements IGetStarknetWallet {
    #private;
    walletObjRef: {
        current?: IStarknetWindowObject;
    };
    connect(options?: {
        order?: string[] | "community" | "random";
        include?: string[];
        exclude?: string[];
        showList?: boolean;
    }): Promise<IStarknetWindowObject | undefined>;
    disconnect(): boolean;
    getStarknet(): IStarknetWindowObject;
}
declare const gsw: GetStarknetWallet;
export default gsw;
