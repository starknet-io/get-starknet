import type { WalletWithStarknetFeatures } from "@starknet-io/get-starknet-wallet-standard/features";
import { useCallback, useState } from "react";

export type UseConnect = {
  connected?: WalletWithStarknetFeatures;
  connect: (wallet: WalletWithStarknetFeatures) => void;
};

export function useConnect() {
  const [connected, setConnected] = useState<
    WalletWithStarknetFeatures | undefined
  >(undefined);

  const connect = useCallback(async (wallet: WalletWithStarknetFeatures) => {
    console.log("HEHEHEHH");
    const result = await wallet.features["standard:connect"].connect({
      silent: false,
    });
    console.log(result);
    setConnected(wallet);
  }, []);

  return {
    connected,
    connect,
  };
}
