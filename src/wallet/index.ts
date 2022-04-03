import type { IStarknetWindowObject } from "./types";

export default function register(wallet: IStarknetWindowObject) {
    if (!window.starknet_wallets) {
        window.starknet_wallets = [];
    }
    window.starknet_wallets.push(wallet);
}
