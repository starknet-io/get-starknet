import type { WalletWithStarknetFeatures } from "@starknet-io/get-starknet-wallet-standard/features";
import type { EIP1193Provider } from "viem";

export type EIP6963ProviderInfo = {
  rdns: string;
};

export type EIP1193Adapter = (
  info: EIP6963ProviderInfo,
  provider: EIP1193Provider,
) => WalletWithStarknetFeatures | null;
