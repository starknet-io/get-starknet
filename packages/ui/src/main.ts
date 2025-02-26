import show, { type WalletProviderWithStoreVersion } from "./modal"
import sn, {
  type BrowserStoreVersion,
  type DisconnectOptions,
  type GetWalletOptions,
  type OperatingSystemStoreVersion,
  type RequestAccountsParameters,
  type StarknetWindowObject,
  type WalletProvider,
} from "@starknet-io/get-starknet-core"
import Bowser from "bowser"

export type {
  StarknetWindowObject,
  DisconnectOptions,
} from "@starknet-io/get-starknet-core"

const ssrSafeWindow = typeof window !== "undefined" ? window : null

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
  storeVersion = getBrowserStoreVersionFromBrowser(),
  osVersion = getOperatingSystemStoreVersionFromBrowser(),
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
    return enableWithVersion(wallet, { silent_mode: true })
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
