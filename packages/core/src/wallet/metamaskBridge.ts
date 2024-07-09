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
): Promise<MetaMaskProvider | null> {
  let handled = false
  return new Promise<MetaMaskProvider | null>((resolve) => {
    const handleEIP6963Provider = (event: CustomEvent) => {
      const { info, provider } = event.detail
      if (
        ["io.metamask", "io.metamask.flask"].includes(info.rdns) &&
        isMetaMaskProvider(provider)
      ) {
        resolve(provider)
        handled = true
      }
    }

    if (typeof windowObject.addEventListener === "function") {
      windowObject.addEventListener(
        "eip6963:announceProvider",
        handleEIP6963Provider,
      )
    }

    setTimeout(() => {
      if (!handled) {
        resolve(null)
      }
    }, timeout)

    // Notify event listeners and other parts of the dapp that a provider is requested.
    if (typeof windowObject.dispatchEvent === "function") {
      windowObject.dispatchEvent(new Event("eip6963:requestProvider"))
    }
  })
}

async function waitForMetaMaskProvider(
  windowObject: Record<string, unknown>,
  { timeout = 3000, retries = 0 } = {},
): Promise<MetaMaskProvider | null> {
  return detectMetaMaskProvider(windowObject, { timeout })
    .catch(function () {
      return null
    })
    .then(function (provider) {
      if (provider || retries === 0) {
        return provider
      }
      return waitForMetaMaskProvider(windowObject, {
        timeout,
        retries: retries - 1,
      })
    })
}

async function detectMetamaskSupport(windowObject: Record<string, unknown>) {
  const provider = await waitForMetaMaskProvider(windowObject, { retries: 3 })
  return provider
}

async function fetchMetaMaskSnapWallet(provider: unknown) {
  await init({
    name: "MetaMaskStarknetSnapWallet",
    remotes: [
      {
        name: "MetaMaskStarknetSnapWallet",
        alias: "MetaMaskStarknetSnapWallet",
        entry:
          "https://snaps.consensys.io/starknet/get-starknet/v1/remoteEntry.js", //"http://localhost:8082/remoteEntry.js",
      },
    ],
  })

  const result = await loadRemote("MetaMaskStarknetSnapWallet/index")

  const { MetaMaskSnapWallet } = result as {
    MetaMaskSnapWallet: any
    MetaMaskSnap: any
  }

  const metaMaskSnapWallet = new MetaMaskSnapWallet(provider, "*")
  return metaMaskSnapWallet as IStarknetWindowObject
}

function createMetaMaskProviderWrapper(
  walletInfo: WalletProvider,
  provider: unknown,
): StarknetWindowObject {
  let metaMaskSnapWallet: IStarknetWindowObject | undefined
  let fetchPromise: Promise<IStarknetWindowObject> | undefined = undefined
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
      if (!metaMaskSnapWallet) {
        fetchPromise = fetchPromise || fetchMetaMaskSnapWallet(provider)
        metaMaskSnapWallet = await fetchPromise
      }

      const accounts = await metaMaskSnapWallet!.enable()
      return accounts
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
  if (windowObject.hasOwnProperty("starknet_metamask")) {
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

  windowObject.starknet_metamask = createMetaMaskProviderWrapper(
    metamaskWalletInfo,
    provider,
  )
}

export { injectMetamaskBridge }
