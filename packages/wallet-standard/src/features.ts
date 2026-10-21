import type { RequestFn } from "@starknet-io/types-js";
import type { Wallet, WalletWithFeatures } from "@wallet-standard/base";
import {
  StandardConnect,
  type StandardConnectFeature,
  StandardDisconnect,
  type StandardDisconnectFeature,
  StandardEvents,
  type StandardEventsFeature,
} from "@wallet-standard/features";

export const StarknetWalletApi = "starknet:walletApi";

export type StarknetWalletApiVersion = "1.0.0";

/** A Wallet Standard feature for wallets that implement Starknet's wallet API. */
export type StarknetWalletRequestFeature = {
  readonly [StarknetWalletApi]: {
    readonly version: StarknetWalletApiVersion;
    readonly request: RequestFn;
    readonly walletVersion: string;
    readonly id: string;
  };
};

export {
  StandardConnect,
  type StandardConnectFeature,
  StandardDisconnect,
  type StandardDisconnectFeature,
  StandardEvents,
  type StandardEventsChangeProperties,
  type StandardEventsFeature,
  type StandardEventsListeners,
  type StandardEventsNames,
  type StandardEventsOnMethod,
  type StandardEventsVersion,
} from "@wallet-standard/features";

export type StarknetFeatures = StarknetWalletRequestFeature &
  StandardConnectFeature &
  StandardDisconnectFeature &
  StandardEventsFeature;

export type WalletWithStarknetFeatures = WalletWithFeatures<StarknetFeatures>;

export const RequiredStarknetFeatures = [
  StarknetWalletApi,
  StandardConnect,
  StandardDisconnect,
  StandardEvents,
] as const satisfies (keyof StarknetFeatures)[];

/** Check if a wallet is a Starknet wallet. */
export function isStarknetWallet(
  wallet: Wallet,
): wallet is WalletWithStarknetFeatures {
  return RequiredStarknetFeatures.every(
    (feature) => feature in wallet.features,
  );
}
