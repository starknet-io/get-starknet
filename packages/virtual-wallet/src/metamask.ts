import { init, loadRemote } from "@module-federation/runtime";
import type { StarknetWalletAccount } from "@starknet-io/get-starknet-wallet-standard";
import type { StarknetChain } from "@starknet-io/get-starknet-wallet-standard/chains";
import {
  formatStarknetChainId,
  isStarknetChain,
  STARKNET_CHAIN_PREFIX,
  WELL_KNOWN_STARKNET_CHAINS,
} from "@starknet-io/get-starknet-wallet-standard/chains";
import {
  type StarknetFeatures,
  StarknetWalletApi,
  type WalletWithStarknetFeatures,
} from "@starknet-io/get-starknet-wallet-standard/features";
import type {
  RequestFnCall,
  RpcMessage,
  RpcTypeToMessageMap,
  StarknetWindowObject,
} from "@starknet-io/types-js";
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
import { Mutex } from "async-mutex";
import type { EIP1193Provider } from "viem";

import type { EIP6963ProviderInfo } from "./types";

export function metaMaskVirtualWallet(
  info: EIP6963ProviderInfo,
  provider: EIP1193Provider,
): WalletWithStarknetFeatures | null {
  const rdnsCheck =
    info.rdns === "io.metamask" || info.rdns === "io.metamask.flask";
  if (rdnsCheck && isMetaMaskProvider(provider)) {
    return new MetaMaskVirtualWallet(provider);
  }

  return null;
}

export class MetaMaskVirtualWallet implements WalletWithStarknetFeatures {
  #listeners: { [E in StandardEventsNames]?: StandardEventsListeners[E][] } =
    {};
  #account: { address: string; chain: StarknetChain } | null = null;
  #swo: StarknetWindowObject | null = null;
  #lock: Mutex = new Mutex();
  #name = "MetaMask";
  #icon =
    "data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMTIiIGhlaWdodD0iMTg5IiB2aWV3Qm94PSIwIDAgMjEyIDE4OSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cG9seWdvbiBmaWxsPSIjQ0RCREIyIiBwb2ludHM9IjYwLjc1IDE3My4yNSA4OC4zMTMgMTgwLjU2MyA4OC4zMTMgMTcxIDkwLjU2MyAxNjguNzUgMTA2LjMxMyAxNjguNzUgMTA2LjMxMyAxODAgMTA2LjMxMyAxODcuODc1IDg5LjQzOCAxODcuODc1IDY4LjYyNSAxNzguODc1Ii8+PHBvbHlnb24gZmlsbD0iI0NEQkRCMiIgcG9pbnRzPSIxMDUuNzUgMTczLjI1IDEzMi43NSAxODAuNTYzIDEzMi43NSAxNzEgMTM1IDE2OC43NSAxNTAuNzUgMTY4Ljc1IDE1MC43NSAxODAgMTUwLjc1IDE4Ny44NzUgMTMzLjg3NSAxODcuODc1IDExMy4wNjMgMTc4Ljg3NSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjU2LjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjkwLjU2MyAxNTIuNDM4IDg4LjMxMyAxNzEgOTEuMTI1IDE2OC43NSAxMjAuMzc1IDE2OC43NSAxMjMuNzUgMTcxIDEyMS41IDE1Mi40MzggMTE3IDE0OS42MjUgOTQuNSAxNTAuMTg4Ii8+PHBvbHlnb24gZmlsbD0iI0Y4OUMzNSIgcG9pbnRzPSI3NS4zNzUgMjcgODguODc1IDU4LjUgOTUuMDYzIDE1MC4xODggMTE3IDE1MC4xODggMTIzLjc1IDU4LjUgMTM2LjEyNSAyNyIvPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTYuMzEzIDk2LjE4OCAuNTYzIDE0MS43NSAzOS45MzggMTM5LjUgNjUuMjUgMTM5LjUgNjUuMjUgMTE5LjgxMyA2NC4xMjUgNzkuMzEzIDU4LjUgODMuODEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi4zNzUgODcuMTg4IDEyNiA2NS4yNSAxMjAuMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSI0Ni4xMjUgMTAxLjgxMyA2NS4yNSAxMTkuODEzIDY1LjI1IDEzNy44MTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjY1LjI1IDEyMC4zNzUgODcuNzUgMTI2IDk1LjA2MyAxNTAuMTg4IDkwIDE1MyA2NS4yNSAxMzguMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSI2NS4yNSAxMzguMzc1IDYwLjc1IDE3My4yNSA5MC41NjMgMTUyLjQzOCIvPjxwb2x5Z29uIGZpbGw9IiNFQThFM0EiIHBvaW50cz0iOTIuMjUgMTAyLjM3NSA5NS4wNjMgMTUwLjE4OCA4Ni42MjUgMTI1LjcxOSIvPjxwb2x5Z29uIGZpbGw9IiNEODdDMzAiIHBvaW50cz0iMzkuMzc1IDEzOC45MzggNjUuMjUgMTM4LjM3NSA2MC43NSAxNzMuMjUiLz48cG9seWdvbiBmaWxsPSIjRUI4RjM1IiBwb2ludHM9IjEyLjkzOCAxODguNDM4IDYwLjc1IDE3My4yNSAzOS4zNzUgMTM4LjkzOCAuNTYzIDE0MS43NSIvPjxwb2x5Z29uIGZpbGw9IiNFODgyMUUiIHBvaW50cz0iODguODc1IDU4LjUgNjQuNjg4IDc4Ljc1IDQ2LjEyNSAxMDEuMjUgOTIuMjUgMTAyLjkzOCIvPjxwb2x5Z29uIGZpbGw9IiNERkNFQzMiIHBvaW50cz0iNjAuNzUgMTczLjI1IDkwLjU2MyAxNTIuNDM4IDg4LjMxMyAxNzAuNDM4IDg4LjMxMyAxODAuNTYzIDY4LjA2MyAxNzYuNjI1Ii8+PHBvbHlnb24gZmlsbD0iI0RGQ0VDMyIgcG9pbnRzPSIxMjEuNSAxNzMuMjUgMTUwLjc1IDE1Mi40MzggMTQ4LjUgMTcwLjQzOCAxNDguNSAxODAuNTYzIDEyOC4yNSAxNzYuNjI1IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyNzIuMjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjcwLjMxMyAxMTIuNSA2NC4xMjUgMTI1LjQzOCA4Ni4wNjMgMTE5LjgxMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMTUwLjE4OCAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFODhGMzUiIHBvaW50cz0iMTIuMzc1IC41NjMgODguODc1IDU4LjUgNzUuOTM4IDI3Ii8+PHBhdGggZmlsbD0iIzhFNUEzMCIgZD0iTTEyLjM3NTAwMDIsMC41NjI1MDAwMDggTDIuMjUwMDAwMDMsMzEuNTAwMDAwNSBMNy44NzUwMDAxMiw2NS4yNTAwMDEgTDMuOTM3NTAwMDYsNjcuNTAwMDAxIEw5LjU2MjUwMDE0LDcyLjU2MjUgTDUuMDYyNTAwMDgsNzYuNTAwMDAxMSBMMTEuMjUsODIuMTI1MDAxMiBMNy4zMTI1MDAxMSw4NS41MDAwMDEzIEwxNi4zMTI1MDAyLDk2Ljc1MDAwMTQgTDU4LjUwMDAwMDksODMuODEyNTAxMiBDNzkuMTI1MDAxMiw2Ny4zMTI1MDA0IDg5LjI1MDAwMTMsNTguODc1MDAwMyA4OC44NzUwMDEzLDU4LjUwMDAwMDkgQzg4LjUwMDAwMTMsNTguMTI1MDAwOSA2My4wMDAwMDA5LDM4LjgxMjUwMDYgMTIuMzc1MDAwMiwwLjU2MjUwMDAwOCBaIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjExLjUgMCkiPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTYuMzEzIDk2LjE4OCAuNTYzIDE0MS43NSAzOS45MzggMTM5LjUgNjUuMjUgMTM5LjUgNjUuMjUgMTE5LjgxMyA2NC4xMjUgNzkuMzEzIDU4LjUgODMuODEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi4zNzUgODcuMTg4IDEyNiA2NS4yNSAxMjAuMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSI0Ni4xMjUgMTAxLjgxMyA2NS4yNSAxMTkuODEzIDY1LjI1IDEzNy44MTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjY1LjI1IDEyMC4zNzUgODcuNzUgMTI2IDk1LjA2MyAxNTAuMTg4IDkwIDE1MyA2NS4yNSAxMzguMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSI2NS4yNSAxMzguMzc1IDYwLjc1IDE3My4yNSA5MCAxNTMiLz48cG9seWdvbiBmaWxsPSIjRUE4RTNBIiBwb2ludHM9IjkyLjI1IDEwMi4zNzUgOTUuMDYzIDE1MC4xODggODYuNjI1IDEyNS43MTkiLz48cG9seWdvbiBmaWxsPSIjRDg3QzMwIiBwb2ludHM9IjM5LjM3NSAxMzguOTM4IDY1LjI1IDEzOC4zNzUgNjAuNzUgMTczLjI1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSIxMi45MzggMTg4LjQzOCA2MC43NSAxNzMuMjUgMzkuMzc1IDEzOC45MzggLjU2MyAxNDEuNzUiLz48cG9seWdvbiBmaWxsPSIjRTg4MjFFIiBwb2ludHM9Ijg4Ljg3NSA1OC41IDY0LjY4OCA3OC43NSA0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi45MzgiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjcwLjMxMyAxMTIuNSA2NC4xMjUgMTI1LjQzOCA4Ni4wNjMgMTE5LjgxMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMTUwLjE4OCAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFODhGMzUiIHBvaW50cz0iMTIuMzc1IC41NjMgODguODc1IDU4LjUgNzUuOTM4IDI3Ii8+PHBhdGggZmlsbD0iIzhFNUEzMCIgZD0iTTEyLjM3NTAwMDIsMC41NjI1MDAwMDggTDIuMjUwMDAwMDMsMzEuNTAwMDAwNSBMNy44NzUwMDAxMiw2NS4yNTAwMDEgTDMuOTM3NTAwMDYsNjcuNTAwMDAxIEw5LjU2MjUwMDE0LDcyLjU2MjUgTDUuMDYyNTAwMDgsNzYuNTAwMDAxMSBMMTEuMjUsODIuMTI1MDAxMiBMNy4zMTI1MDAxMSw4NS41MDAwMDEzIEwxNi4zMTI1MDAyLDk2Ljc1MDAwMTQgTDU4LjUwMDAwMDksODMuODEyNTAxMiBDNzkuMTI1MDAxMiw2Ny4zMTI1MDA0IDg5LjI1MDAwMTMsNTguODc1MDAwMyA4OC44NzUwMDEzLDU4LjUwMDAwMDkgQzg4LjUwMDAwMTMsNTguMTI1MDAwOSA2My4wMDAwMDA5LDM4LjgxMjUwMDYgMTIuMzc1MDAwMiwwLjU2MjUwMDAwOCBaIi8+PC9nPjwvZz48L3N2Zz4=";

  constructor(private provider: MetaMaskProvider) {}

  get version() {
    return "1.0.0" as const;
  }

  get name() {
    return this.#name;
  }

  get icon() {
    return this.#icon as WalletWithStarknetFeatures["icon"];
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
        version: "1.0.0" as const,
        request: this.#request.bind(this),
        walletVersion: "2.0.0",
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
      const accounts = await this.#request({
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

      await this.#onAccountsChanged(accounts);
    }

    return { accounts: this.accounts };
  };

  #disconnect: StandardDisconnectMethod = async () => {
    this.#disconnected();
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

  #on: StandardEventsOnMethod = (event, listener) => {
    if (!this.#listeners[event]) {
      this.#listeners[event] = [];
    }

    this.#listeners[event].push(listener);

    return (): void => this.#off(event, listener);
  };

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

  #request<T extends RpcMessage["type"]>(
    args: RequestFnCall<T>,
  ): Promise<RpcTypeToMessageMap[T]["result"]> {
    return this.#lock.runExclusive(async () => {
      // Loading the MetaMask snap requires the user to confirm the installation.
      // If the snap is not installed, return an empty array to avoid the wallet popup.
      if (!this.#swo && args.type === "wallet_getPermissions") {
        return [];
      }

      if (!this.#swo) {
        this.#swo = await this.#loadWallet(this.provider);
        // Bind properties from the virtual wallet to make sure they're up-to-date.
        this.#name = this.#swo.name;
        if (typeof this.#swo.icon === "string") {
          this.#icon = this.#swo.icon;
        } else {
          this.#icon = this.#swo.icon.light;
        }
      }

      return this.#swo.request(args);
    });
  }

  async #loadWallet(provider: MetaMaskProvider): Promise<StarknetWindowObject> {
    await init({
      name: "MetaMaskStarknetSnapWallet",
      remotes: [
        {
          name: "MetaMaskStarknetSnapWallet",
          alias: "MetaMaskStarknetSnapWallet",
          entry: `https://snaps.consensys.io/starknet/get-starknet/v1/remoteEntry.js?ts=${Date.now()}`,
        },
      ],
    });

    const result = await loadRemote<{
      MetaMaskSnapWallet: new (
        provider: MetaMaskProvider,
        version: string,
      ) => StarknetWindowObject;
    }>("MetaMaskStarknetSnapWallet/index");

    if (!result) {
      // as `loadWallet` should only trigger when the wallet selected,
      // therefore it is make sense to throw error to indicate the wallet is not loaded
      throw new Error("Failed to load MetaMask Wallet");
    }

    const swo = new result.MetaMaskSnapWallet(provider, "*");
    swo.on("accountsChanged", this.#onAccountsChanged.bind(this));
    swo.on("networkChanged", this.#onNetworkChanged.bind(this));
    return swo;
  }

  async #getStarknetChain(): Promise<StarknetChain> {
    const chainId = await this.#request({
      type: "wallet_requestChainId",
    });
    const chain = `${STARKNET_CHAIN_PREFIX}${chainId}` as const;

    if (!isStarknetChain(chain)) {
      throw new Error("Invalid Starknet chain");
    }

    return chain;
  }

  async #onAccountsChanged(accounts: string[]) {
    if (!accounts || accounts.length === 0) {
      this.#disconnected();
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

  #onNetworkChanged(chainId?: string, accounts?: string[]) {
    if (!chainId) {
      this.#disconnected();
      return;
    }

    const chain = formatStarknetChainId(chainId);

    if (!isStarknetChain(chain)) {
      throw new Error(`Invalid Starknet chain: ${chain}`);
    }

    // Accounts should always be set, but check just in case.
    if (accounts?.length > 0) {
      const [account] = accounts;

      this.#account = { address: account, chain };
      this.#emit("change", { accounts: this.accounts });
    } else {
      this.#account.chain = chain;
      this.#emit("change", { accounts: this.accounts });
    }
  }
}

export type MetaMaskProvider = {
  isMetaMask: boolean;
  request(options: { method: string }): Promise<void>;
};

export function isMetaMaskProvider(obj: unknown): obj is MetaMaskProvider {
  return (
    obj !== null &&
    typeof obj === "object" &&
    Object.hasOwn(obj, "isMetaMask") &&
    Object.hasOwn(obj, "request")
  );
}
