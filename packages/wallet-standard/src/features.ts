import type { RequestFn } from "@starknet-io/types-js";
import type { Wallet, WalletWithFeatures } from "@wallet-standard/base";

export const StarknetWalletRequest = "starknet:walletRequest";

export type StarknetWalletRequestVersion = "1.0.0";

/** A Wallet Standard feature for wallets that implement Starknet's wallet API. */
export type StarknetWalletRequestFeature = {
  readonly [StarknetWalletRequest]: {
    readonly version: StarknetWalletRequestVersion;
    readonly request: RequestFn;
  };
};

export type StarknetFeatures = StarknetWalletRequestFeature;
export type WalletWithStarknetFeatures = WalletWithFeatures<StarknetFeatures>;

export const RequiredStarknetFeatures = [
  StarknetWalletRequest,
] as const satisfies (keyof StarknetFeatures)[];

/** Check if a wallet is a Starknet wallet. */
export function isStarknetWallet(
  wallet: Wallet,
): wallet is WalletWithStarknetFeatures {
  return RequiredStarknetFeatures.every(
    (feature) => feature in wallet.features,
  );
}
