import { loadRemote, init } from "@module-federation/runtime"
import type {
  IStarknetWindowObject,
  RpcMessage,
  StarknetWindowObject,
  WalletEvents,
} from "../StarknetWindowObject"
import wallets, { WalletProvider } from "../discovery"

interface MetaMaskProvider {
  isMetaMask: boolean
  request(options: { method: string }): Promise<void>
}

declare global {
  interface Window {
    ethereum?: MetaMaskProvider
  }
}

function detectMetaMaskProvider({ timeout = 3000 } = {}) {
  let handled = false
  return new Promise<MetaMaskProvider | null>((resolve) => {
    if (window.ethereum) {
      handleEthereum()
    } else {
      window.addEventListener("ethereum#initialized", handleEthereum, {
        once: true,
      })
      setTimeout(() => {
        handleEthereum()
      }, timeout)
    }
    function handleEthereum() {
      if (handled) {
        return
      }
      handled = true
      window.removeEventListener("ethereum#initialized", handleEthereum)
      const { ethereum } = window
      if (ethereum && ethereum.isMetaMask) {
        resolve(ethereum)
      } else {
        resolve(null)
      }
    }
  })
}

async function waitForMetaMaskProvider(
  options: { timeout?: number; retries?: number } = {},
): Promise<MetaMaskProvider | null> {
  const { timeout = 3000, retries = 0 } = options

  let provider: MetaMaskProvider | null = null
  try {
    provider = await detectMetaMaskProvider({ timeout })
  } catch {
    // Silent error - do nothing
  }

  if (provider) {
    return provider
  }

  if (retries === 0) {
    return null
  }

  provider = await waitForMetaMaskProvider({ timeout, retries: retries - 1 })
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
  const provider = await waitForMetaMaskProvider({ retries: 3 })
  if (!provider) {
    return null
  }

  const snapSupport = await hasSnapSupport(provider)
  if (!snapSupport) {
    return null
  }

  return provider
}

function createMetaMaskProviderWrapper(
  walletInfo: WalletProvider,
): StarknetWindowObject {
  let metaMaskSnapWallet: IStarknetWindowObject | undefined
  const metaMaskProviderWrapper: IStarknetWindowObject = {
    id: walletInfo.id,
    name: walletInfo.name,
    icon: walletInfo.icon,
    get version() {
      return metaMaskSnapWallet?.version ?? "0.0.0"
    },
    get isConnected() {
      return metaMaskSnapWallet?.isConnected ?? false
    },
    get provider() {
      return metaMaskSnapWallet?.provider
    },
    get account() {
      return metaMaskSnapWallet?.account
    },
    get selectedAddress() {
      return metaMaskSnapWallet?.selectedAddress
    },
    get chainId() {
      return metaMaskSnapWallet?.chainId
    },
    request<T extends RpcMessage>(
      call: Omit<T, "result">,
    ): Promise<T["result"]> {
      if (!metaMaskSnapWallet) {
        throw new Error("Wallet not enabled")
      }
      return metaMaskSnapWallet.request(call)
    },
    async enable(): Promise<string[]> {
      await init({
        name: "MetaMaskStarknetSnapWallet",
        remotes: [
          {
            name: "MetaMaskStarknetSnapWallet",
            alias: "MetaMaskStarknetSnapWallet",
            entry:
              "https://s3.eu-central-1.amazonaws.com/dev.snaps.consensys.io/get-starknet/remoteEntry.js",
          },
        ],
      })

      const result = await loadRemote("MetaMaskStarknetSnapWallet/index")

      const { MetaMaskSnapWallet, MetaMaskSnap } = result as {
        MetaMaskSnapWallet: any
        MetaMaskSnap: any
      }

      const provider = await MetaMaskSnap.GetProvider(window)
      const wallet = new MetaMaskSnapWallet(provider, "*")

      return await wallet.enable()
    },
    isPreauthorized() {
      return metaMaskSnapWallet?.isPreauthorized() ?? Promise.resolve(false)
    },
    on<E extends WalletEvents>(
      event: E["type"],
      handleEvent: E["handler"],
    ): void {
      if (!metaMaskSnapWallet) {
        throw new Error("Wallet not enabled")
      }
      // @ts-ignore: Metamask currently doesn't support on method
      return metaMaskSnapWallet.on(event, handleEvent)
    },
    off<E extends WalletEvents>(event: E["type"], handleEvent: E["handler"]) {
      if (!metaMaskSnapWallet) {
        throw new Error("Wallet not enabled")
      }
      // @ts-ignore: Metamask currently doesn't support off method
      return metaMaskSnapWallet.off(event, handleEvent)
    },
  }

  return metaMaskProviderWrapper as StarknetWindowObject
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

  window.starknet_metamask = createMetaMaskProviderWrapper(metamaskWalletInfo)
}

export { injectMetamaskBridge }
