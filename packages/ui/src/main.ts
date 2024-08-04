import show, { type WalletProviderWithStoreVersion } from "./modal"
import Bowser from "bowser"
import sn, {
  type BrowserStoreVersion,
  type DisconnectOptions,
  type GetWalletOptions,
  type OperatingSystemStoreVersion,
  type StarknetWindowObject,
  type WalletProvider,
  ssrSafeWindow,
} from "get-starknet-core"

export type { StarknetWindowObject, DisconnectOptions } from "get-starknet-core"

function getBrowserStoreVersionFromBrowser(): BrowserStoreVersion | null {
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
    case "safari":
      return "safari"
    default:
      return null
  }
}

function getOperatingSystemStoreVersionFromBrowser(): OperatingSystemStoreVersion | null {
  const os =
    Bowser.getParser(ssrSafeWindow?.navigator.userAgent)
      .getOS()
      ?.name?.toLowerCase() ?? null
  switch (os) {
    case "ios":
    case "android":
      return os
    default:
      return null
  }
}

export interface ConnectOptions extends GetWalletOptions {
  modalMode?: "alwaysAsk" | "canAsk" | "neverAsk"
  modalTheme?: "light" | "dark" | "system"
  storeVersion?: BrowserStoreVersion
  osVersion?: OperatingSystemStoreVersion
}

const enableWithVersion = async (wallet: StarknetWindowObject | null) => {
  if (!wallet) {
    return null
  }
  return sn.enable(wallet, { starknetVersion: "v5" }).catch(() => null)
}

export const connect = async ({
  modalMode = "canAsk",
  storeVersion = getBrowserStoreVersionFromBrowser(),
  osVersion = getOperatingSystemStoreVersionFromBrowser(),
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

  const discoveryWalletsByStoreVersion = discoveryWallets.reduce<
    WalletProviderWithStoreVersion[]
  >((results, w) => {
    const download =
      // prioritize OS url
      w.downloads[osVersion] ||
      // fallback to browser url
      w.downloads[storeVersion]
    if (download) {
      const store = Object.keys(w.downloads).find(
        (key) => w.downloads[key] === download,
      ) as keyof WalletProvider["downloads"]

      const isMobileStore = store === "android" || store === "ios"
      const name = isMobileStore ? `${w.name} Mobile` : `Install ${w.name}`

      results.push({ ...w, name, download })
    }
    return results
  }, [])

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
