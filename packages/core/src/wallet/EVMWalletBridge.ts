import { WalletEventListener } from "@starknet-io/types-js"
import { RequestFn } from "@starknet-io/types-js"

interface Request extends RequestFn {
  (request: { method: string; params?: Array<unknown> }): Promise<unknown>
}

export interface EVMWalletProvider {
  request: Request
  on: WalletEventListener
  off: WalletEventListener
  id: string
  name: string
  icon: string
  version: "1.0.0"
}

export interface EVMWalletInfo {
  icon: string
  name: string
  rdns: string
  uuid: string
  version: "1.0.0"
}

function isEVMProvider(obj: unknown): obj is EVMWalletProvider {
  return (
    obj !== null &&
    typeof obj === "object" &&
    obj.hasOwnProperty("sendAsync") &&
    obj.hasOwnProperty("request")
  )
}

async function detectEVMProvider(
  windowObject: Record<string, unknown>,
  { timeout = 3000 } = {},
): Promise<
  { provider: EVMWalletProvider | null; info: EVMWalletInfo | null }[]
> {
  let handled = false
  let wallets: { provider: EVMWalletProvider; info: EVMWalletInfo }[] = []

  return new Promise((resolve) => {
    const handleEIP6963Provider = (event: CustomEvent) => {
      let { info, provider } = event.detail

      // Rename specific wallet names
      if (info.rdns === "com.bitget.web3") {
        info = { ...info, name: "Bitget Wallet via Rosettanet" }
      } else if (info.rdns === "com.okex.wallet") {
        info = { ...info, name: "OKX Wallet via Rosettanet" }
      }

      // Avoid duplicates based on unique info.rdns
      if (!wallets.some((wallet) => wallet.info.rdns === info.rdns)) {
        wallets.push({ info, provider })
      }

      if (isEVMProvider(provider)) {
        resolve(wallets)
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
        resolve([{ provider: null, info: null }])
      }
    }, timeout)

    if (typeof windowObject.dispatchEvent === "function") {
      windowObject.dispatchEvent(new Event("eip6963:requestProvider"))
    }
  })
}

async function waitForEVMProvider(
  windowObject: Record<string, unknown>,
  options: { timeout?: number; retries?: number } = {},
): Promise<
  { provider: EVMWalletProvider | null; info: EVMWalletInfo | null }[]
> {
  const { timeout = 3000, retries = 0 } = options

  try {
    const result = await detectEVMProvider(windowObject, { timeout })
    if (result[0].provider) {
      return result
    }
  } catch {
    // Silent error
  }

  if (retries === 0) {
    return [{ provider: null, info: null }]
  }

  return waitForEVMProvider(windowObject, {
    timeout,
    retries: retries - 1,
  })
}

export async function detectEVMSupport(
  windowObject: Record<string, unknown>,
): Promise<
  { provider: EVMWalletProvider | null; info: EVMWalletInfo | null }[]
> {
  const result = await waitForEVMProvider(windowObject, {
    retries: 3,
  })

  return result // Returns provider or null
}
