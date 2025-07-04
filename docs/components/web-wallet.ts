import type { StarknetWalletAccount } from "@starknet-io/get-starknet-wallet-standard";
import {
  type StarknetChain,
  WELL_KNOWN_STARKNET_CHAINS,
} from "@starknet-io/get-starknet-wallet-standard/chains";
import {
  type StarknetFeatures,
  StarknetWalletApi,
  type WalletWithStarknetFeatures,
} from "@starknet-io/get-starknet-wallet-standard/features";
import type { RequestFn } from "@starknet-io/types-js";
import {
  StandardConnect,
  type StandardConnectMethod,
  StandardDisconnect,
  type StandardDisconnectMethod,
  StandardEvents,
  type StandardEventsOnMethod,
} from "@wallet-standard/features";

export class WebWallet implements WalletWithStarknetFeatures {
  #account: { address: string; chain: StarknetChain } | null = null;

  static MESSAGE_TYPE = "webwallet:credentials" as const;
  static WALLET_ID = "web-wallet" as const;

  get version() {
    return "1.0.0" as const;
  }

  get name() {
    return "Web Wallet";
  }

  get icon() {
    return "data:image/svg+xml;base64,example" as const;
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
        walletVersion: this.version,
      },
    };
  }

  get chains() {
    return WELL_KNOWN_STARKNET_CHAINS;
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

  #connect: StandardConnectMethod = async (_options) => {
    if (!this.#account) {
      try {
        const { username } = await this.#promptViaPopup();
        console.log(`Login Success: ${username}`);
        const accounts = [
          "0x01ee87a3b4f65544ce9b1b2bed78916b5b058d7404daa1018f6dc2f92aeead55",
        ];
        await this.#updateAccount(accounts);
      } catch (error) {
        console.error("Login Failed", error);
        return { accounts: this.accounts };
      }
    }

    return { accounts: this.accounts };
  };

  #promptViaPopup(): Promise<{ username: string; password: string }> {
    return new Promise((resolve, reject) => {
      const url = "/web-wallet-login";
      const width = 420;
      const height = 560;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        url,
        "WebWalletLogin",
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      if (!popup) {
        reject(new Error("Popup blocked"));
        return;
      }

      const cleanup = () => {
        window.removeEventListener("message", listener);
        clearInterval(checkClosed);
      };

      const listener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        const { type, id, payload } = event.data || {};

        if (
          type === WebWallet.MESSAGE_TYPE &&
          id === WebWallet.WALLET_ID &&
          payload?.username &&
          payload?.password
        ) {
          cleanup();
          resolve(payload);
          popup.close();
        }
      };

      window.addEventListener("message", listener);

      const checkClosed = setInterval(() => {
        if (popup.closed) {
          cleanup();
          reject(new Error("Popup closed by user"));
        }
      }, 500);
    });
  }

  #disconnect: StandardDisconnectMethod = async () => {
    this.#disconnected();
  };

  #on: StandardEventsOnMethod = (_event, _listener) => {
    return (): void => {};
  };

  #disconnected() {
    if (this.#account) {
      this.#account = null;
    }
  }

  async #updateAccount(accounts: string[]) {
    if (accounts.length === 0) {
      return;
    }

    const [account] = accounts;

    this.#account = { address: account, chain: this.chains[0] };
  }

  #request(..._args: Parameters<RequestFn>): ReturnType<RequestFn> {
    throw new Error("Not implemented");
  }
}
