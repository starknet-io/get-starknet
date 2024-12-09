import type { VirtualWallet } from "../../types"
import { metaMaskVirtualWallet } from "./metaMaskVirtualWallet"
import type { StarknetWindowObject } from "@starknet-io/types-js"

const virtualWallets: VirtualWallet[] = [metaMaskVirtualWallet]

function initiateVirtualWallets(windowObject: Record<string, unknown>) {
  virtualWallets.forEach(async (virtualWallet) => {
    if (!(virtualWallet.windowKey in windowObject)) {
      const hasSupport = await virtualWallet.hasSupport(windowObject)
      if (hasSupport) {
        windowObject[virtualWallet.windowKey] = virtualWallet
      }
    }
  })
}

const virtualWalletsMap: Record<string, StarknetWindowObject> = {}

async function resolveVirtualWallet(
  windowObject: Record<string, unknown>,
  virtualWallet: VirtualWallet,
) {
  let wallet: StarknetWindowObject = virtualWalletsMap[virtualWallet.id]
  if (!wallet) {
    wallet = await virtualWallet.loadWallet(windowObject)
    virtualWalletsMap[virtualWallet.id] = wallet
  }

  return wallet
}

export { initiateVirtualWallets, resolveVirtualWallet, virtualWallets }
