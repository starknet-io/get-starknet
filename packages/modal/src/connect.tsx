import type { WalletWithStarknetFeatures } from "@starknet-io/get-starknet-wallet-standard/features";
import { createContext, useCallback, useContext, useState } from "react";

export type UseConnect = {
  connected?: WalletWithStarknetFeatures;
  connect: (wallet: WalletWithStarknetFeatures) => void;
  disconnect: () => void;
};

export const UseConnectContext = createContext<UseConnect | null>(null);

export function UseConnectProvider({
  children,
}: { children: React.ReactNode }) {
  const [connected, setConnected] = useState<
    WalletWithStarknetFeatures | undefined
  >(undefined);

  const connect = useCallback(async (wallet: WalletWithStarknetFeatures) => {
    const result = await wallet.features["standard:connect"].connect({
      silent: false,
    });
    if (result.accounts.length > 0) {
      setConnected(wallet);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (!connected) {
      return;
    }
    await connected.features["standard:disconnect"].disconnect();
    setConnected(undefined);
  }, [connected]);

  return (
    <UseConnectContext.Provider value={{ connected, connect, disconnect }}>
      {children}
    </UseConnectContext.Provider>
  );
}

export function useConnect(): UseConnect {
  const context = useContext(UseConnectContext);
  if (!context) {
    throw new Error("useConnect must be used within a GetStarknetProvider");
  }
  return context;
}
