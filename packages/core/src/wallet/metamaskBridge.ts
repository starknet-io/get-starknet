import {
  DisconnectedStarknetWindowObject,
  RpcMessage,
} from "../StarknetWindowObject"
import wallets, { WalletProvider } from "../discovery"
import type { MetaMaskProvider } from "@consensys/get-starknet/dist/type"
import detectEthereumProvider from "@metamask/detect-provider"
import type { ProviderInterface } from "starknet"

class EmptyMetaMaskProvider implements DisconnectedStarknetWindowObject {
  id: string
  name: string
  icon: string
  version = "0.0.0"
  isConnected = false as const
  provider: undefined | ProviderInterface
  constructor(
    private metamaskProvider: MetaMaskProvider,
    walletInfo: WalletProvider,
  ) {
    this.id = walletInfo.id
    this.name = walletInfo.name
    this.icon = walletInfo.icon
  }
  request<T extends RpcMessage>(): Promise<T["result"]> {
    throw new Error("Wallet not enabled")
  }
  async enable(options?: { starknetVersion?: "v4" | "v5" }): Promise<string[]> {
    const { MetaMaskSnapWallet } = await import("@consensys/get-starknet")
    const metaMaskSnapWallet = new MetaMaskSnapWallet(this.metamaskProvider, "*")

    Object.assign(this, metaMaskSnapWallet)
    this.constructor.prototype = metaMaskSnapWallet.constructor.prototype

    return await this.enable(options)
  }
  isPreauthorized() {
    return Promise.resolve(false)
  }
  on() {
    throw new Error("Wallet not enabled")
  }
  off() {
    throw new Error("Wallet not enabled")
  }
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

  window.starknet_metamask = new EmptyMetaMaskProvider(
    provider,
    metamaskWalletInfo,
  )
}

export { injectMetamaskBridge }
