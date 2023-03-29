import Modal from "./Modal.svelte"
import type {
  ConnectedStarknetWindowObject,
  ExtensionWalletProvider,
  StarknetWindowObject,
  WebWalletProvider,
} from "get-starknet-core"

export interface ExtensionWalletProviderWithStoreVersion
  extends Omit<ExtensionWalletProvider, "downloads"> {
  download: string
}

function excludeWallets<T extends { id: string }>(
  wallets: Array<T>,
  exclude: Array<{ id: string }>,
): T[] {
  return wallets.filter((w) => !exclude.some((e) => e.id === w.id))
}

export default async function show({
  extensionWallets,
  webWallets,
  injectedWallets,
  lastWallet,
  preAuthorizedWallets,
  openWebWallet,
  connect,
  modalOptions,
}: {
  lastWallet?: StarknetWindowObject
  injectedWallets?: StarknetWindowObject[]
  preAuthorizedWallets?: StarknetWindowObject[]
  extensionWallets?: ExtensionWalletProviderWithStoreVersion[]
  webWallets?: WebWalletProvider[]
  openWebWallet?: (
    wp: WebWalletProvider,
  ) => Promise<StarknetWindowObject | null>
  connect?: (
    wallet: StarknetWindowObject | null,
  ) => Promise<ConnectedStarknetWindowObject | null>
  modalOptions?: {
    theme?: "light" | "dark" | "system"
  }
}): Promise<StarknetWindowObject | null> {
  return new Promise((resolve) => {
    // make sure wallets are not shown twice
    const fixedWallets = [lastWallet].filter(Boolean)
    preAuthorizedWallets = excludeWallets(preAuthorizedWallets, fixedWallets)
    injectedWallets = excludeWallets(injectedWallets, [
      ...fixedWallets,
      ...preAuthorizedWallets,
    ])
    extensionWallets = excludeWallets(extensionWallets, [
      ...fixedWallets,
      ...injectedWallets,
      ...preAuthorizedWallets,
    ])

    const modal = new Modal({
      target: document.body,
      props: {
        callback: async (value: StarknetWindowObject | null) => {
          const enabledValue = (await connect?.(value)) ?? value
          modal.$destroy()
          resolve(enabledValue)
        },
        lastWallet,
        injectedWallets,
        preAuthorizedWallets,
        extensionWallets,
        webWallets,
        openWebWallet,
        theme:
          modalOptions?.theme === "system" ? null : modalOptions?.theme ?? null,
      },
    })
  })
}
