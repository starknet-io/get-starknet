import { IStarknetWindowObject } from "../wallet/types";
import { WalletProvider } from "../discovery/types";

export default async function show(
    installed: IStarknetWindowObject[],
    discovery: WalletProvider[],
    preAuthorizedWallets: IStarknetWindowObject[]
): Promise<IStarknetWindowObject | undefined> {
    // todo impl UI -
    //  1. select installed wallets
    //  2. wallets discovery list
    return installed?.[0];
}
