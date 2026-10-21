import type { WalletWithStarknetFeatures } from "@starknet-io/get-starknet-wallet-standard/features";
import type { WalletInformation } from "@starknet-io/get-starknet-wallets";

/** A wallet that is available */
export type AvailableWallet = {
  state: "available";
  name: string;
  wallet: WalletWithStarknetFeatures;
  info?: WalletInformation;
};

/** A wallet that is not available */
export type UnavailableWallet = {
  state: "unavailable";
  name: string;
  info: WalletInformation;
};

/** A wallet that could be available or unavailable */
export type MaybeWallet = AvailableWallet | UnavailableWallet;
