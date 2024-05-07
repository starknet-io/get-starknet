import type {
  IStarknetWindowObject,
  RpcMessage,
  StarknetWindowObject,
  WalletEvents,
} from "../StarknetWindowObject"
import wallets, { WalletProvider } from "../discovery"
import { init, loadRemote } from "@module-federation/runtime"

interface MetaMaskProvider {
  isMetaMask: boolean
  request(options: { method: string }): Promise<void>
}

function isMetaMaskProvider(obj: unknown): obj is MetaMaskProvider {
  return (
    obj !== null &&
    typeof obj === "object" &&
    obj.hasOwnProperty("isMetaMask") &&
    obj.hasOwnProperty("request")
  )
}

function detectMetaMaskProvider(
  windowObject: Record<string, unknown>,
  { timeout = 3000 } = {},
) {
  let handled = false
  return new Promise<MetaMaskProvider | null>((resolve) => {
    if (windowObject.ethereum) {
      handleEthereum()
    } else {
      if (typeof windowObject.addEventListener === "function") {
        windowObject.addEventListener("ethereum#initialized", handleEthereum, {
          once: true,
        })
      }
      setTimeout(() => {
        handleEthereum()
      }, timeout)
    }
    function handleEthereum() {
      if (handled) {
        return
      }
      handled = true
      if (typeof windowObject.removeEventListener === "function") {
        windowObject.removeEventListener("ethereum#initialized", handleEthereum)
      }
      const { ethereum } = windowObject
      if (isMetaMaskProvider(ethereum)) {
        resolve(ethereum)
      } else {
        resolve(null)
      }
    }
  })
}

async function waitForMetaMaskProvider(
  windowObject: Record<string, unknown>,
  options: { timeout?: number; retries?: number } = {},
): Promise<MetaMaskProvider | null> {
  const { timeout = 3000, retries = 0 } = options

  let provider: MetaMaskProvider | null = null
  try {
    provider = await detectMetaMaskProvider(windowObject, { timeout })
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

async function detectMetamaskSupport(windowObject: Record<string, unknown>) {
  const provider = await waitForMetaMaskProvider(windowObject, { retries: 3 })
  return provider
}

function createMetaMaskProviderWrapper(
  walletInfo: WalletProvider,
  provider: unknown,
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
        throw new Error("Wallet not enabled!")
      }
      return metaMaskSnapWallet.request(call)
    },
    async enable(): Promise<string[]> {
      if (!metaMaskSnapWallet) {
        await init({
          name: "MetaMaskStarknetSnapWallet",
          remotes: [
            {
              name: "MetaMaskStarknetSnapWallet",
              alias: "MetaMaskStarknetSnapWallet",
              entry:
                "https://snaps.consensys.io/starknet/get-starknet/v1/remoteEntry.js",
            },
          ],
        })

        const result = await loadRemote("MetaMaskStarknetSnapWallet/index")

        const { MetaMaskSnapWallet } = result as {
          MetaMaskSnapWallet: any
          MetaMaskSnap: any
        }

        metaMaskSnapWallet = new MetaMaskSnapWallet(provider, "*")
      }

      return await metaMaskSnapWallet!.enable()
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

async function injectMetamaskBridge(windowObject: Record<string, unknown>) {
  if (window.hasOwnProperty("starknet_metamask")) {
    return
  }

  const metamaskWalletInfo = wallets.find((wallet) => wallet.id === "metamask")
  if (!metamaskWalletInfo) {
    return
  }

  const provider = await detectMetamaskSupport(windowObject)
  if (!provider) {
    return
  }

  window.starknet_metamask = createMetaMaskProviderWrapper(
    metamaskWalletInfo,
    provider,
  )
}

export { injectMetamaskBridge }
