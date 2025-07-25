import type { RequestFn, StarknetWindowObject } from "@starknet-io/types-js";
import type { Wallet } from "@wallet-standard/base";
import {
  StandardConnect,
  type StandardConnectMethod,
  StandardDisconnect,
  type StandardDisconnectMethod,
  StandardEvents,
  type StandardEventsListeners,
  type StandardEventsNames,
  type StandardEventsOnMethod,
} from "@wallet-standard/features";

import {
  formatStarknetChainId,
  isStarknetChain,
  type StarknetChain,
  WELL_KNOWN_STARKNET_CHAINS,
} from "./chains";
import {
  type StarknetFeatures,
  StarknetWalletApi,
  type WalletWithStarknetFeatures,
} from "./features";
import type { StarknetWalletAccount } from "./wallet";

export class StarknetInjectedWallet implements WalletWithStarknetFeatures {
  #listeners: { [E in StandardEventsNames]?: StandardEventsListeners[E][] } =
    {};
  #account: { address: string; chain: StarknetChain } | null = null;

  constructor(private readonly injected: StarknetWindowObject) {
    this.injected.on("accountsChanged", this.#onAccountsChanged.bind(this));
    this.injected.on("networkChanged", this.#onNetworkChanged.bind(this));
  }

  get version() {
    return "1.0.0" as const;
  }

  get name() {
    return this.injected.name;
  }

  get icon() {
    if (typeof this.injected.icon === "string") {
      return this.injected.icon as Wallet["icon"];
    }

    return this.injected.icon.light as Wallet["icon"];
  }

  get features(): StarknetFeatures {
    return {
      [StandardConnect]: {
        version: "1.0.0" as const,
        connect: this.#connect.bind(this),
      },
      [StandardDisconnect]: {
        version: "1.0.0" as const,
        disconnect: this.#disconnect.bind(this),
      },
      [StandardEvents]: {
        version: "1.0.0" as const,
        on: this.#on.bind(this),
      },
      [StarknetWalletApi]: {
        id: this.injected.id,
        version: "1.0.0" as const,
        request: this.#request.bind(this),
        walletVersion: this.injected.version,
      },
    };
  }

  get chains() {
    return WELL_KNOWN_STARKNET_CHAINS.slice();
  }

  get accounts(): StarknetWalletAccount[] {
    if (this.#account) {
      return [
        {
          address: this.#account.address,
          publicKey: new Uint8Array(),
          chains: [this.#account.chain],
          features: [],
        },
      ];
    }

    return [];
  }

  #connect: StandardConnectMethod = async ({ silent }) => {
    if (!this.#account) {
      const accounts = await this.injected.request({
        type: "wallet_requestAccounts",
        params: {
          silent_mode: silent,
        },
      });

      // TODO(fra): maybe we should throw an error here?
      // User rejected the request.
      if (accounts.length === 0) {
        return { accounts: [] };
      }

      await this.#updateAccount(accounts);
    }

    return { accounts: this.accounts };
  };

  #disconnect: StandardDisconnectMethod = async () => {
    this.#disconnected();
  };

  #on: StandardEventsOnMethod = (event, listener) => {
    if (!this.#listeners[event]) {
      this.#listeners[event] = [];
    }

    this.#listeners[event].push(listener);

    return (): void => this.#off(event, listener);
  };

  #emit<E extends StandardEventsNames>(
    event: E,
    ...args: Parameters<StandardEventsListeners[E]>
  ): void {
    if (!this.#listeners[event]) return;

    for (const listener of this.#listeners[event]) {
      listener.apply(null, args);
    }
  }

  #off<E extends StandardEventsNames>(
    event: E,
    listener: StandardEventsListeners[E],
  ): void {
    this.#listeners[event] = this.#listeners[event]?.filter(
      (existingListener) => listener !== existingListener,
    );
  }

  #disconnected() {
    if (this.#account) {
      this.#account = null;
      this.#emit("change", { accounts: this.accounts });
    }
  }

  async #onAccountsChanged(accounts: string[]) {
    if (!accounts || accounts.length === 0) {
      this.#disconnected();
      return;
    }

    if (!this.#account) {
      return;
    }

    await this.#updateAccount(accounts);
  }

  #onNetworkChanged(chainId?: string, accounts?: string[]) {
    if (!chainId) {
      this.#disconnected();
      return;
    }

    if (!this.#account) {
      return;
    }

    const chain = formatStarknetChainId(chainId);

    if (!isStarknetChain(chain)) {
      throw new Error(`Invalid Starknet chain: ${chain}`);
    }

    // Some wallets (like Keplr) don't provide accounts on network change.
    if (accounts?.length > 0) {
      const [account] = accounts;

      this.#account = { address: account, chain };
      this.#emit("change", { accounts: this.accounts });
    } else {
      this.#account = { address: this.#account?.address, chain };
      this.#emit("change", { accounts: this.accounts });
    }
  }

  async #updateAccount(accounts: string[]) {
    if (accounts.length === 0) {
      return;
    }

    const [account] = accounts;

    if (this.#account?.chain) {
      // Only account changed. No need to make a request for the chain id.
      this.#account.address = account;
      this.#emit("change", { accounts: this.accounts });
    } else {
      const chain = await this.#getStarknetChain();
      this.#account = { address: account, chain };
      this.#emit("change", { accounts: this.accounts });
    }
  }

  #request(...args: Parameters<RequestFn>): ReturnType<RequestFn> {
    return this.injected.request(...args);
  }

  async #getStarknetChain(): Promise<StarknetChain> {
    const chainId = await this.injected.request({
      type: "wallet_requestChainId",
    });
    const chain = formatStarknetChainId(chainId);

    if (!isStarknetChain(chain)) {
      throw new Error(`Invalid Starknet chain: ${chain}`);
    }

    return chain;
  }
}
