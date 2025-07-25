import type { Store } from "@starknet-io/get-starknet-discovery";
import {
  StarknetWalletApi,
  type WalletWithStarknetFeatures,
} from "@starknet-io/get-starknet-wallet-standard/features";
import type { WalletInformation } from "@starknet-io/get-starknet-wallets";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MaybeWallet } from "./maybe-wallet";

export type SelectedWallet = {
  wallet?: MaybeWallet;
};

export type GetStarknetState = {
  injectedWallets: readonly WalletWithStarknetFeatures[];
  extraWallets: readonly WalletWithStarknetFeatures[];
  recommendedWallets: readonly WalletInformation[];
  wallets: readonly MaybeWallet[];
  selected?: SelectedWallet;
  onSelectedChange: (selected?: SelectedWallet) => void;
};

/**
 * This hook is used to get the state for the Starknet provider.
 *
 * @param store - The store to use.
 * @param recommendedWallets - The recommended wallets to show the user.
 * @param extraWallets - The extra wallets to show the user.
 * @returns `GetStarknetState` - A state for the Starknet provider.
 */
export function useGetStarknet({
  store,
  recommendedWallets,
  extraWallets,
}: {
  store: Store;
  recommendedWallets: WalletInformation[];
  extraWallets: WalletWithStarknetFeatures[];
}): GetStarknetState {
  // We should use useSyncExternalStore instead
  const injectedWallets = useInjectedWalletsStore(store);

  const [selected, setSelected] = useState<SelectedWallet | undefined>();

  const walletIdToWallet = useMemo(() => {
    return Object.fromEntries(
      [...injectedWallets, ...extraWallets].map((wallet) => [
        wallet.features[StarknetWalletApi].id,
        wallet,
      ]),
    );
  }, [injectedWallets, extraWallets]);

  const wallets = useMemo(() => {
    const unavailableWallets = recommendedWallets
      .filter((wallet) => !walletIdToWallet[wallet.id])
      .map((info) => ({
        state: "unavailable" as const,
        name: info.name,
        info,
      }));

    const availableWallets = Object.values(walletIdToWallet).map((wallet) => ({
      state: "available" as const,
      name: wallet.name,
      wallet,
      info: recommendedWallets.find(
        (w) => w.id === wallet.features[StarknetWalletApi].id,
      ),
    }));
    return [...unavailableWallets, ...availableWallets];
  }, [recommendedWallets, walletIdToWallet]);

  const onSelectedChange = useCallback((selected?: SelectedWallet) => {
    setSelected(selected);
  }, []);

  return {
    injectedWallets,
    extraWallets,
    recommendedWallets,
    wallets,
    selected,
    onSelectedChange,
  };
}

function useInjectedWalletsStore(store: Store) {
  const [wallets, setWallets] = useState<readonly WalletWithStarknetFeatures[]>(
    [],
  );

  useEffect(() => {
    setWallets(store.getWallets());

    return store.subscribe((wallets) => setWallets(wallets));
  }, [store]);

  return wallets;
}
