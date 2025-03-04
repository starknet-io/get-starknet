import type { StarknetWindowObject } from "@starknet-io/types-js"

export function scanObjectForWallets(
  obj: Record<string, any>,
  isWalletObject: (wallet: any) => boolean,
): StarknetWindowObject[] {
  return Object.values(
    Object.getOwnPropertyNames(obj).reduce<
      Record<string, StarknetWindowObject>
    >((wallets, key) => {
      if (key.startsWith("starknet")) {
        const wallet = obj[key]

        if (isWalletObject(wallet) && !wallets[wallet.id]) {
          wallets[wallet.id] = wallet
        }
      }
      return wallets
    }, {}),
  )
}
