import type { WalletWithStarknetFeatures } from "@starknet-io/get-starknet-wallet-standard/features";

export type EIP6963ProviderInfo = {
  rdns: string;
};

/** A minimal EIP-1193 provider interface used for EIP-6963 discovery. */
export type EIP1193Provider = {
  request(args: { method: string; params?: unknown }): Promise<unknown>;
  on(event: string, listener: (...args: unknown[]) => void): void;
  removeListener(event: string, listener: (...args: unknown[]) => void): void;
};

export type EIP1193Adapter = (
  info: EIP6963ProviderInfo,
  provider: EIP1193Provider,
) => WalletWithStarknetFeatures | null;
