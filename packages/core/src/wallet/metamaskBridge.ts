import type { MetaMaskProvider } from "@consensys/get-starknet"
import { MetaMaskSnapWallet } from "@consensys/get-starknet"
import detectEthereumProvider from "@metamask/detect-provider"

async function waitForEthereumProvider(
  options: { timeout?: number; retries?: number } = {},
): Promise<MetaMaskProvider | null> {
  const { timeout = 3000, retries = 0 } = options

  let provider: MetaMaskProvider | null = null
  try {
    provider = await detectEthereumProvider<MetaMaskProvider>({ timeout })
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
    await provider.request({
      method: "wallet_getSnaps",
    })
    return true
  } catch {
    return false
  }
}

async function bootstrapMetamaskBridge() {
  if (window.hasOwnProperty("starknet_metamask")) {
    return
  }

  let provider: MetaMaskProvider | null = null

  provider = await waitForEthereumProvider({ retries: 3 })
  if (!provider) {
    return
  }

  const snapSupport = await hasSnapSupport(provider)
  if (!snapSupport) {
    return
  }

  window["starknet_metamask"] = new MetaMaskSnapWallet(provider)
}

export { bootstrapMetamaskBridge }
