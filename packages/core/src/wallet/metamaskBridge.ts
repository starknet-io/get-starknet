import type {
  IStarknetWindowObject,
  RpcMessage,
  StarknetWindowObject,
  WalletEvents,
} from "../StarknetWindowObject"
import wallets, { WalletProvider } from "../discovery"
import { init, loadRemote } from "@module-federation/runtime"

async function fetchMetaMaskSnapWallet(windowObject: Record<string, unknown>) {
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

  const metaMaskSnapWallet = new MetaMaskSnapWallet("*")
  await (metaMaskSnapWallet as any).init(windowObject)
  return metaMaskSnapWallet as IStarknetWindowObject
}

function createMetaMaskProviderWrapper(
  walletInfo: WalletProvider,
  windowObject: Record<string, unknown>,
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
        fetchPromise = fetchPromise || fetchMetaMaskSnapWallet(windowObject)
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

  windowObject.starknet_metamask = createMetaMaskProviderWrapper(
    metamaskWalletInfo,
    windowObject,
  )
}

export { injectMetamaskBridge }
