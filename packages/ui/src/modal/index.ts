import Modal from "./Modal.svelte"
import type {
  ConnectedStarknetWindowObject,
  StarknetWindowObject,
  WalletProvider,
} from "get-starknet-core"

export interface WalletProviderWithStoreVersion
  extends Omit<WalletProvider, "downloads"> {
  download: string
}

export default async function show({
  discoveryWallets,
  installedWallets,
  lastWallet,
  defaultWallet,
  preAuthorizedWallets,
  enable,
  modalOptions,
}: {
  lastWallet?: StarknetWindowObject
  defaultWallet?: StarknetWindowObject
  installedWallets?: StarknetWindowObject[]
  preAuthorizedWallets?: StarknetWindowObject[]
  discoveryWallets?: WalletProviderWithStoreVersion[]
  enable?: (
    wallet: StarknetWindowObject | null,
  ) => Promise<ConnectedStarknetWindowObject | null>
  modalOptions?: {
    theme?: "light" | "dark" | "system"
  }
}): Promise<StarknetWindowObject | null> {
  return new Promise((resolve) => {
    const modal = new Modal({
      target: document.body,
      props: {
        callback: async (value: StarknetWindowObject | null) => {
          const enabledValue = (await enable?.(value)) ?? value
          modal.$destroy()
          resolve(enabledValue)
        },
        lastWallet,
        defaultWallet,
        installedWallets,
        preAuthorizedWallets,
        discoveryWallets,
        theme:
          modalOptions?.theme === "system" ? null : modalOptions?.theme ?? null,
      },
    })
  })
}
