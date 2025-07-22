import { createStore, type Store } from "@starknet-io/get-starknet-discovery";
import type { WalletWithStarknetFeatures } from "@starknet-io/get-starknet-wallet-standard/features";
import {
  wallets as allStarknetWallets,
  type WalletInformation,
} from "@starknet-io/get-starknet-wallets";
import { createContext, useContext } from "react";
import { UseConnectProvider } from "./connect";
import { type GetStarknetState, useGetStarknet } from "./state";

const GetStarknetContext = createContext<GetStarknetState>({
  injectedWallets: [],
  extraWallets: [],
  recommendedWallets: [],
  wallets: [],
  selected: undefined,
  onSelectedChange: () => {},
});

const defaultStore = createStore();

/** Props for the {@link GetStarknetProvider} component.
 *
 * These are the information we need from the user.
 */
export type GetStarknetProviderProps = {
  /** Recommended wallets to show the user. */
  recommendedWallets?: WalletInformation[];
  /** Non-injected wallets */
  extraWallets?: WalletWithStarknetFeatures[];
  /** Override the wallet discovery store */
  store?: Store;
  /** Children component */
  children: React.ReactNode;
};

export function useStarknetProvider() {
  return useContext(GetStarknetContext);
}

export function GetStarknetProvider({
  extraWallets = [],
  recommendedWallets: userRecommendedWallets,
  store: userProvidedStore,
  children,
}: GetStarknetProviderProps) {
  const store = userProvidedStore ?? defaultStore;
  const recommendedWallets = userRecommendedWallets ?? allStarknetWallets;

  const state = useGetStarknet({
    store,
    recommendedWallets,
    extraWallets,
  });

  return (
    <GetStarknetContext.Provider value={state}>
      <UseConnectProvider>{children}</UseConnectProvider>
    </GetStarknetContext.Provider>
  );
}
