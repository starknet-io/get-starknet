import show, { type WalletProviderWithStoreVersion } from "./modal"
import sn, {
  type DisconnectOptions,
  type GetWalletOptions,
  type RequestAccountsParameters,
  type StarknetWindowObject,
} from "@starknet-io/get-starknet-core"
import Bowser from "bowser"

export type {
  StarknetWindowObject,
  DisconnectOptions,
} from "@starknet-io/get-starknet-core"

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

const enableWithVersion = async (
  wallet: StarknetWindowObject | null,
  options?: RequestAccountsParameters,
) => {
  if (!wallet) {
    return null
  }
  return sn.enable(wallet, options).catch(() => null)
}

export const connect = async ({
  modalMode = "canAsk",
  storeVersion = getStoreVersionFromBrowser(),
  modalTheme,
  ...restOptions
}: ConnectOptions = {}): Promise<StarknetWindowObject | null> => {
  const authorizedWallets = await sn.getAuthorizedWallets({
    ...restOptions,
  })

  const lastWallet = await sn.getLastConnectedWallet()
  if (modalMode === "neverAsk") {
    const wallet =
      authorizedWallets.find((w) => w.id === lastWallet?.id) ??
      authorizedWallets[0] // at this point authorized is already sorted

    // return `wallet` even if it's null/undefined since we aren't allowed
    // to show any "connect" related UI
    return enableWithVersion(wallet, { silentMode: true })
  }

  const installedWallets = await sn.getAvailableWallets(restOptions)
  if (
    modalMode === "canAsk" &&
    // we return/display wallet options once per first-dapp (ever) connect
    lastWallet
  ) {
    const wallet =
      authorizedWallets.find((w) => w.id === lastWallet?.id) ??
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
    authorizedWallets,
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
