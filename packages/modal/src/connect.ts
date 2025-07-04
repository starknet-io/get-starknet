import type { WalletWithStarknetFeatures } from "@starknet-io/get-starknet-wallet-standard/features";
import { useCallback, useState } from "react";

export type UseConnect = {
  connected?: WalletWithStarknetFeatures;
  connect: (wallet: WalletWithStarknetFeatures) => void;
  disconnect: () => void;
};

export function useConnect(): UseConnect {
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

  return {
    connected,
    connect,
    disconnect,
  };
}
