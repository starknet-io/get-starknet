import {
  type WalletWithStarknetFeatures,
  isStarknetWallet,
} from "@get-starknet/wallet-standard/features";

import { registerStandardWalletDiscovery } from "./standard-wallet";
import { registerInjectedWalletDiscovery } from "./injected-wallet";

export type CleanupListener = () => void;
export type Listener = (wallets: readonly WalletWithStarknetFeatures[]) => void;

export type Store = {
  getWallets: () => WalletWithStarknetFeatures[];
  subscribe: (listener: Listener) => CleanupListener;
  _refreshInjectedWallets: () => void;
};

// Track how a wallet was discovered to prefer standard wallets over (legacy) injected wallets
type DiscoveredStarknetWallet = {
  discoverer: "standard" | "injected";
  wallet: WalletWithStarknetFeatures;
};

export function createStore(): Store {
  const listeners = new Set<Listener>();
  let wallets: DiscoveredStarknetWallet[] = [];

  function emitChanges() {
    for (const listener of listeners) {
      listener(wallets.map(({ wallet }) => wallet).slice());
    }
  }

  registerStandardWalletDiscovery((wallet) => {
    if (!isStarknetWallet(wallet)) return;

    const existing = wallets.find((w) => w.wallet.name === wallet.name);

    if (existing) {
      // If the wallet exists but is an injected wallet this library registered,
      // replace it with the standard wallet registered by the wallet itself.
      if (existing.discoverer !== "standard") {
        wallets = [
          { discoverer: "standard", wallet },
          ...wallets.filter((w) => w.wallet.name !== wallet.name),
        ];

        emitChanges();
      }
    } else {
      wallets = [{ discoverer: "standard", wallet }, ...wallets];

      emitChanges();
    }

    return () => {
      wallets = wallets.filter((w) => w.wallet.name !== wallet.name);

      emitChanges();
    };
  });

  const { refresh: refreshInjectedWallets } = registerInjectedWalletDiscovery(
    (wallet) => {
      if (!isStarknetWallet(wallet)) return;

      const existing = wallets.find((w) => w.wallet.name === wallet.name);

      // Only register injected wallets if they are not already registered.
      // We should not override standard wallets with injected wallets.
      if (!existing) {
        wallets = [{ discoverer: "injected", wallet }, ...wallets];

        emitChanges();
      }

      return () => {
        wallets = wallets.filter((w) => w.wallet.name !== wallet.name);

        emitChanges();
      };
    },
  );

  return {
    _refreshInjectedWallets: refreshInjectedWallets,
    getWallets() {
      return wallets.map(({ wallet }) => wallet).slice();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
