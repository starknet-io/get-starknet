import { useConnect } from "@starknet-io/get-starknet-modal";
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
import { createContext, useCallback, useContext, useRef } from "react";

type WebWalletContext = {
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  wallet: WebWallet;
};

const WebWalletContext = createContext<WebWalletContext | null>(null);

export const WebWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wallet = useRef(new WebWallet());

  const setUsername = useCallback((username: string) => {
    wallet.current.setUsername(username);
  }, []);

  const setPassword = useCallback((password: string) => {
    wallet.current.setPassword(password);
  }, []);

  return (
    <WebWalletContext
      value={{ setUsername, setPassword, wallet: wallet.current }}>
      {children}
    </WebWalletContext>
  );
};

export const useWebWallet = (): WebWalletContext => {
  const context = useContext(WebWalletContext);
  if (!context) {
    throw new Error("useWebWallet must be used within a WebWalletProvider");
  }
  return context;
};

type WebWalletConnectUiProps = {
  onConnect?: (wallet: WalletWithStarknetFeatures) => void;
};

export function WebWalletConnectUi({ onConnect }: WebWalletConnectUiProps) {
  const { setUsername, setPassword, wallet } = useWebWallet();
  const { connect, connected, disconnect } = useConnect();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (connected) {
      disconnect();
      connect(wallet);
      onConnect?.(wallet);
    } else {
      connect(wallet);
      onConnect?.(wallet);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {connected && connected.name === wallet.name ? (
        <div className="flex flex-col gap-4">
          <p className="text-lg">Connected to {wallet.name}</p>
          <p>
            <span className="font-bold">Address:</span>{" "}
            {wallet.accounts[0].address}
          </p>
          <button
            type="button"
            className="!bg-red-500 text-white p-2 rounded"
            onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      ) : (
        <form
          onSubmit={submit}
          autoComplete="off"
          className="rounded p-6 flex flex-col gap-4 w-full max-w-[500px]">
          <h2 className="text-lg font-semibold text-center">
            Web Wallet Login
          </h2>
          <input
            required
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            autoSave="off"
            name="webwallet:username"
            className="border !border-gray-300 p-2 rounded !bg-white !text-gray-900"
          />
          <input
            required
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            autoSave="off"
            className="border !border-gray-300 p-2 rounded !bg-white !text-gray-900"
          />
          <button
            type="submit"
            className={
              "w-full !bg-blue-600 text-white py-2 rounded !hover:bg-blue-700"
            }>
            Connect
          </button>
        </form>
      )}
    </div>
  );
}

export class WebWallet implements WalletWithStarknetFeatures {
  #account: { address: string; chain: StarknetChain } | null = null;
  #username = "";
  #password = "";

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

  setUsername(username: string) {
    this.#username = username;
  }

  setPassword(password: string) {
    this.#password = password;
  }

  #connect: StandardConnectMethod = async (_options) => {
    if (!this.#account) {
      try {
        if (!this.#username || !this.#password) {
          throw new Error("Username and password are required");
        }
        console.log(`Login Success: ${this.#username}`);
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
