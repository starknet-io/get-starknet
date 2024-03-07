import type {
  IStarknetWindowObject,
  RpcMessage,
  StarknetWindowObject,
  WalletEvents,
} from "../StarknetWindowObject"
import wallets, { WalletProvider } from "../discovery"
import type { MetaMaskProvider, MetaMaskSnapWallet } from "@consensys/get-starknet"
import detectEthereumProvider from "@metamask/detect-provider"


function createMetaMaskProviderWrapper(metamaskProvider: MetaMaskProvider, walletInfo: WalletProvider): StarknetWindowObject {
  let metaMaskSnapWallet: MetaMaskSnapWallet | undefined;
  const metaMaskProviderWrapper: IStarknetWindowObject = {
    id: walletInfo.id,
    name: walletInfo.name,
    icon: walletInfo.icon,
    get version() {
      return metaMaskSnapWallet?.version ?? "0.0.0"
    },
    get isConnected() {
      return metaMaskSnapWallet?.isConnected ?? false;
    },
    get provider() {
      return metaMaskSnapWallet?.provider
    },
    get account() {
      return metaMaskSnapWallet?.account;
    },
    get selectedAddress() {
      return metaMaskSnapWallet?.selectedAddress;
    },
    get chainId() {
      return metaMaskSnapWallet?.chainId;
    },
    request<T extends RpcMessage>(call: Omit<T, 'result'>): Promise<T["result"]> {
      if (!metaMaskSnapWallet) {
        throw new Error("Wallet not enabled")
      }
      return metaMaskSnapWallet.request(call);
    },
    async enable(): Promise<string[]> {
      const { MetaMaskSnapWallet } = await import("@consensys/get-starknet")
      metaMaskSnapWallet = new MetaMaskSnapWallet(metamaskProvider, "*")

      return await metaMaskSnapWallet.enable()
    },
    isPreauthorized() {
      return metaMaskSnapWallet?.isPreauthorized() ?? Promise.resolve(false)
    },
    on<E extends WalletEvents>(event: E["type"], handleEvent: E["handler"],): void {
      if (!metaMaskSnapWallet) {
        throw new Error("Wallet not enabled");
      }
      // @ts-ignore: Metamask currently doesn't support on method
      return metaMaskSnapWallet.on(event, handleEvent);
    },
    off<E extends WalletEvents>(event: E["type"], handleEvent: E["handler"],) {
      if (!metaMaskSnapWallet) {
        throw new Error("Wallet not enabled");
      }
      // @ts-ignore: Metamask currently doesn't support off method
      return metaMaskSnapWallet.off(event, handleEvent);
    }
  }

  return metaMaskProviderWrapper as StarknetWindowObject;
}


async function waitForEthereumProvider(
  options: { timeout?: number; retries?: number } = {},
): Promise<MetaMaskProvider | null> {
  const { timeout = 3000, retries = 0 } = options

  let provider: MetaMaskProvider | null = null
  try {
    provider = await detectEthereumProvider({ timeout })
  } catch {
    // Silent error - do nothing
  }

  if (provider) {
    return provider
  }

  if (retries === 0) {
    return null
  }

  provider = await waitForEthereumProvider({ timeout, retries: retries - 1 })
  return provider
}

async function hasSnapSupport(provider: MetaMaskProvider) {
  try {
    await provider.request({ method: "wallet_getSnaps" })
    return true
  } catch {
    return false
  }
}

async function detectMetamaskSupport() {
  const provider = await waitForEthereumProvider({ retries: 3 })
  if (!provider) {
    return null
  }

  const snapSupport = await hasSnapSupport(provider)
  if (!snapSupport) {
    return null
  }

  return provider
}

async function injectMetamaskBridge() {
  if (window.hasOwnProperty("starknet_metamask")) {
    return
  }

  const provider = await detectMetamaskSupport()
  if (!provider) {
    return
  }

  const metamaskWalletInfo = wallets.find((wallet) => wallet.id === "metamask")
  if (!metamaskWalletInfo) {
    return
  }

  window.starknet_metamask = createMetaMaskProviderWrapper(
    provider,
    metamaskWalletInfo,
  )
}

export { injectMetamaskBridge }
