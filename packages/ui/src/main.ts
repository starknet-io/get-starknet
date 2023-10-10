import show, { type WalletProviderWithStoreVersion } from "./modal"
import Bowser from "bowser"
import sn, {
  type DisconnectOptions,
  type GetWalletOptions,
  type StarknetWindowObject,
} from "get-starknet-core"

export type { StarknetWindowObject, DisconnectOptions } from "get-starknet-core"

type StoreVersion = "chrome" | "firefox" | "edge"

const ssrSafeWindow = typeof window !== "undefined" ? window : null

function getStoreVersionFromBrowser(): StoreVersion | null {
  const browserName = Bowser.getParser(ssrSafeWindow?.navigator.userAgent)
    .getBrowserName()
    ?.toLowerCase()
  switch (browserName) {
    case "firefox":
      return "firefox"
    case "microsoft edge":
      return "edge"
    case "android browser":
    case "chrome":
    case "chromium":
    case "electron":
    case "opera": // opera is chromium based
    case "vivaldi": // vivaldi is chromium based
      return "chrome"
    default:
      return null
  }
}

export interface ConnectOptions extends GetWalletOptions {
  modalMode?: "alwaysAsk" | "canAsk" | "neverAsk"
  modalTheme?: "light" | "dark" | "system"
  storeVersion?: StoreVersion
}

const enableWithVersion = async (wallet: StarknetWindowObject | null) => {
  if (!wallet) {
    return null
  }
  window.strkn_wallet = await sn.enable(wallet, { starknetVersion: "v5" }).catch(() => null)
}

export const connect = async ({
  modalMode = "canAsk",
  storeVersion = getStoreVersionFromBrowser(),
  modalTheme,
  ...restOptions
}: ConnectOptions = {}): Promise<StarknetWindowObject | null> => {
  const preAuthorizedWallets = await sn.getPreAuthorizedWallets({
    ...restOptions,
  })

  const lastWallet = await sn.getLastConnectedWallet()
  if (modalMode === "neverAsk") {
    const wallet =
      preAuthorizedWallets.find((w) => w.id === lastWallet?.id) ??
      preAuthorizedWallets[0] // at this point pre-authorized is already sorted

    // return `wallet` even if it's null/undefined since we aren't allowed
    // to show any "connect" related UI
    return enableWithVersion(wallet)
  }

  const installedWallets = await sn.getAvailableWallets(restOptions)
  if (
    modalMode === "canAsk" &&
    // we return/display wallet options once per first-dapp (ever) connect
    lastWallet
  ) {
    const wallet =
      preAuthorizedWallets.find((w) => w.id === lastWallet?.id) ??
      (installedWallets.length === 1 ? installedWallets[0] : undefined)
    if (wallet) {
      return enableWithVersion(wallet)
    } // otherwise fallback to modal
  }

  const discoveryWallets = await sn.getDiscoveryWallets(restOptions)

  const discoveryWalletsByStoreVersion: WalletProviderWithStoreVersion[] =
    discoveryWallets
      .filter((w) => Boolean(w.downloads[storeVersion]))
      .map(({ downloads, ...w }) => ({
        ...w,
        download: downloads[storeVersion],
      }))

  return show({
    lastWallet,
    preAuthorizedWallets,
    installedWallets,
    discoveryWallets: discoveryWalletsByStoreVersion,
    enable: enableWithVersion,
    modalOptions: {
      theme: modalTheme,
    },
  })
}

export function disconnect(options: DisconnectOptions = {}): Promise<void> {
  return sn.disconnect(options)
}
