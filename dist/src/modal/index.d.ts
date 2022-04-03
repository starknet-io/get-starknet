import { IStarknetWindowObject } from "../wallet/types";
import { WalletProvider } from "../discovery/types";
export default function show(installed: IStarknetWindowObject[], discovery: WalletProvider[], preAuthorizedWallets: IStarknetWindowObject[]): Promise<IStarknetWindowObject | undefined>;
