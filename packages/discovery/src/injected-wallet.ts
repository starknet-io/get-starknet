import { StarknetInjectedWallet } from "@starknet-io/get-starknet-wallet-standard";
import type { StarknetWindowObject } from "@starknet-io/types-js";
import type { Wallet } from "@wallet-standard/base";

export function registerInjectedWalletDiscovery(
  register: (wallet: Wallet) => () => void,
): {
  unregister: () => void;
  refresh: () => void;
} {
  if (typeof window === "undefined")
    return {
      unregister: () => {},
      refresh: () => {},
    };

  function refresh() {
    const injectedWallets = scanWindowForWallets(window);

    for (const wallet of injectedWallets) {
      register(new StarknetInjectedWallet(wallet));
    }
  }

  refresh();

  return {
    unregister: () => {},
    refresh,
  };
}

function scanWindowForWallets(window: Window): StarknetWindowObject[] {
  return Object.getOwnPropertyNames(window).reduce((wallets, key) => {
    if (key.startsWith("starknet")) {
      const wallet = window[key];

      if (isStarknetWindowObject(wallet)) {
        wallets.push(wallet);
      }
    }

    return wallets;
  }, []);
}

const STARKNET_WALLET_KEYS = [
  "id",
  "name",
  "version",
  "icon",
  "request",
  "on",
  "off",
];

function isStarknetWindowObject(
  wallet: unknown,
): wallet is StarknetWindowObject {
  if (typeof wallet !== "object" || wallet === null) return false;
  return STARKNET_WALLET_KEYS.every((key) => key in wallet);
}
