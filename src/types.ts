import { IStarknetWindowObject } from "./wallet/types";

declare global {
    interface Window {
        starknet_wallets: IStarknetWindowObject[];
    }
}

export type GetStarknetWalletOptions = {
    /**
     * control wallets order for both "connect to a wallet" and
     * "install a wallet" lists.
     *
     * `array` - set higher + ordered priority to specific wallets by
     * passing an array of wallet ids (just the wallets you would like to
     * promote, other wallets will still be listed in random order)
     *
     * `"community"` - community set order, listed in the wallet-discovery manifest
     *
     * `"random"` - each time the list shows with a different order
     *
     * default is "random"
     */
    order?: string[] | "community" | "random";
    /**
     * list of wallets to include on both "connect to a wallet" and "install a wallet" lists,
     * default is to include all wallets
     */
    include?: string[];
    /**
     * list of wallets to exclude from both "connect to a wallet" and "install a wallet" lists
     * default is not to exclude any wallet
     */
    exclude?: string[];
    /**
     * force-showing the list of wallets, regardless of any default settings
     * and/or pre-authorization state of one of the wallets.
     * default is `false` when disconnected from a wallet,
     * and `true` when already connected to a wallet.
     */
    showList?: boolean;
};

export interface IGetStarknetWallet {
    /**
     * connect to a wallet
     *
     * when disconnected -
     *  - if there is one pre-authorized wallet:
     *      connect to it automatically
     *  - if there are multiple pre-authorized wallets and a default wallet:
     *      connect to it automatically
     *  - if there are multiple pre-authorized wallets and no default wallet:
     *      show them first in the list, ordered by last connect
     *      (where "last connect" stands for the timestamp when the user
     *      have chosen to connect to that wallet via the list)
     *  - if there are no pre-authorized wallets:
     *      show all wallets by dapp chosen order (default to random),
     *      installed wallets first, then other available wallets below
     *
     * when connected -
     *  - show the "connect to a wallet" list
     *      1. display all available wallets respectively to the previously given options
     *      2. allow users to disconnect the current wallet
     *      3. modify default wallet settings
     *
     * @param options
     * @returns Promise of `IStarknetWindowObject` if the user have chosen a
     * wallet from the list, undefined when the list got closed without choosing
     * a wallet (i.e. the user simply canceled the "connect to a wallet" request,
     * or chose to install a wallet from the wallets-discovery list).
     *
     * Once connected to a wallet, clients can retrieve the wallet's
     * `IStarknetWindowObject` instance by calling `getStarknet()`
     */
    connect(
        options?: GetStarknetWalletOptions
    ): Promise<IStarknetWindowObject | undefined>;

    /**
     * disconnect from a wallet
     */
    disconnect(): boolean;

    /**
     * return last-chosen wallet `IStarknetWindowObject` instance,
     * or `undefined` if disconnected
     */
    getStarknet(): IStarknetWindowObject | undefined;
}
