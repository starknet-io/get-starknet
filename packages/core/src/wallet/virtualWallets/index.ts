import type { StarknetWindowObject } from "starknet-types"
import type { VirtualWallet } from "../../types"
import { metaMaskVirtualWallet } from "./metaMaskVirtualWallet"

const virtualWallets: VirtualWallet[] = [metaMaskVirtualWallet]

function initiateVirtualWallets() {
  virtualWallets.forEach(async (virtualWallet) => {
    const hasSupport = await virtualWallet.hasSupport()
    if (hasSupport) {
      window[virtualWallet.windowKey] = virtualWallet
    }
  })
}

const virtualWalletsMap: Record<string, StarknetWindowObject> = {}

async function resolveVirtualWallet(virtualWallet: VirtualWallet) {
  let wallet: StarknetWindowObject = virtualWalletsMap[virtualWallet.id]
  if (!wallet) {
    wallet = await virtualWallet.loadWallet()
    virtualWalletsMap[virtualWallet.id] = wallet
  }

  return wallet
}

export { initiateVirtualWallets, resolveVirtualWallet }
