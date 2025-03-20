import { evmWalletKeys, fullWalletKeys, virtualWalletKeys } from "../types"

function createWalletGuard<T>(keys: (keyof T)[]) {
  return function hasKeys(obj: unknown): obj is T {
    return (
      obj !== null && typeof obj === "object" && keys.every((key) => key in obj)
    )
  }
}

const isFullWallet = createWalletGuard(fullWalletKeys)

const isVirtualWallet = createWalletGuard(virtualWalletKeys)

const isEvmWallet = createWalletGuard(evmWalletKeys)

function isWalletObject(wallet: unknown): boolean {
  try {
    return (
      isFullWallet(wallet) || isVirtualWallet(wallet) || isEvmWallet(wallet)
    )
  } catch (err) {}
  return false
}

export { isVirtualWallet, isFullWallet, isWalletObject, isEvmWallet }
