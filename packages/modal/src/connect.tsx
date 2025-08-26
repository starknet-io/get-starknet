import {
  StandardConnect,
  StandardDisconnect,
  StarknetWalletApi,
  type WalletWithStarknetFeatures,
} from "@starknet-io/get-starknet-wallet-standard/features";
import { createContext, useCallback, useContext, useState } from "react";
import { setLastConnectedWalletId } from "./helper";

export type UseConnect = {
  /** The connected wallet. */
  connected?: WalletWithStarknetFeatures;
  /** Connect to a wallet. */
  connect: (wallet: WalletWithStarknetFeatures) => Promise<boolean>;
  /** Whether the connection is in progress. */
  isConnecting: boolean;
  /** Whether the connection has failed or rejected. */
  isError: boolean;
  /** Disconnect from the connected wallet. */
  disconnect: () => Promise<void>;
};

export const UseConnectContext = createContext<UseConnect | null>(null);

export function UseConnectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [connected, setConnected] = useState<
    WalletWithStarknetFeatures | undefined
  >(undefined);

  const connect = useCallback(async (wallet: WalletWithStarknetFeatures) => {
    try {
      setIsError(false);
      setIsConnecting(true);
      const result = await wallet.features[StandardConnect].connect({
        silent: false,
      });

      setIsConnecting(false);
      if (result.accounts.length > 0) {
        setConnected(wallet);
        setLastConnectedWalletId(wallet.features[StarknetWalletApi].id);
        setIsError(false);
        return true;
      }
      setIsError(true);
      return false;
    } catch (error) {
      setIsError(true);
      setIsConnecting(false);
      throw error;
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (!connected) {
      return;
    }
    await connected.features[StandardDisconnect].disconnect();
    setConnected(undefined);
  }, [connected]);

  return (
    <UseConnectContext.Provider
      value={{ connected, connect, disconnect, isConnecting, isError }}>
      {children}
    </UseConnectContext.Provider>
  );
}

/**
 * This hook is used to connect to a wallet.
 *
 * @example
 *
 * ```tsx
 * import { useConnect } from "@starknet-io/get-starknet-modal";
 *
 * function Dapp() {
 *   const { connect, disconnect, isConnecting, isError, connected } = useConnect();
 *   return <button onClick={() => connect(wallet)}>Connect</button>;
 * }
 * ```
 *
 * @returns `UseConnect` - The hook to connect to a wallet.
 */
export function useConnect(): UseConnect {
  const context = useContext(UseConnectContext);
  if (!context) {
    throw new Error("useConnect must be used within a GetStarknetProvider");
  }
  return context;
}
