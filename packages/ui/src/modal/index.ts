import Modal from "./Modal.svelte"
import type {
  StarknetWindowObject,
  WalletProvider,
} from "@starknet-io/get-starknet-core"

export interface WalletProviderWithStoreVersion
  extends Omit<WalletProvider, "downloads"> {
  download: string
}

function excludeWallets<T extends { id: string }>(
  wallets: Array<T>,
  exclude: Array<{ id: string }>,
): T[] {
  return wallets.filter((w) => !exclude.some((e) => e.id === w.id))
}

export default async function show({
  discoveryWallets,
  installedWallets,
  lastWallet,
  authorizedWallets,
  enable,
  modalOptions,
}: {
  lastWallet?: StarknetWindowObject
  installedWallets?: StarknetWindowObject[]
  authorizedWallets?: StarknetWindowObject[]
  discoveryWallets?: WalletProviderWithStoreVersion[]
  enable?: (
    wallet: StarknetWindowObject | null,
  ) => Promise<StarknetWindowObject | null>
  modalOptions?: {
    theme?: "light" | "dark" | "system"
  }
}): Promise<StarknetWindowObject | null> {
  return new Promise((resolve) => {
    // make sure wallets are not shown twice
    const fixedWallets = [lastWallet].filter(Boolean)
    authorizedWallets = excludeWallets(authorizedWallets, fixedWallets)
    installedWallets = excludeWallets(installedWallets, [
      ...fixedWallets,
      ...authorizedWallets,
    ])
    discoveryWallets = excludeWallets(discoveryWallets, [
      ...fixedWallets,
      ...installedWallets,
      ...authorizedWallets,
    ])

    const modal = new Modal({
      target: document.body,
      props: {
        callback: async (value: StarknetWindowObject | null) => {
          const enabledValue = (await enable?.(value)) ?? value
          modal.$destroy()
          resolve(enabledValue)
        },
        lastWallet,
        installedWallets,
        authorizedWallets,
        discoveryWallets,
        theme:
          modalOptions?.theme === "system" ? null : modalOptions?.theme ?? null,
      },
    })
  })
}
