import { loadRemote, init } from "@module-federation/runtime"
import { VirtualWallet } from "../../types"

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

const metaMaskVirtualWallet: VirtualWallet = {
  name: "metamask",
  windowKey: "starknet_metamask",
  async loadWallet() {
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

    return wallet
  },
  async hasSupport() {
    const provider = await detectMetamaskSupport()
    return Boolean(provider)
  },
}

export { metaMaskVirtualWallet }
