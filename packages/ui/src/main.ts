import show, { type WalletProviderWithStoreVersion } from "./modal"
import Bowser from "bowser"
import sn, {
  type GetWalletOptions,
  type StarknetWindowObject,
} from "get-starknet-core"

type StoreVersion = "chrome" | "firefox" | "edge"

function getStoreVersionFromBrowser(): StoreVersion | null {
  const browserName = Bowser.getParser(window.navigator.userAgent)
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

export interface DisconnectOptions {
  clearDefaultWallet?: boolean
}

const enableWithVersion = async (wallet: StarknetWindowObject | null) => {
  if (!wallet) {
    return null
  }
  return sn.enable(wallet, { starknetVersion: "v4" }).catch(() => null)
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
  if (modalMode !== "alwaysAsk") {
    if (
      lastWallet &&
      preAuthorizedWallets.some((w) => w.id === lastWallet.id)
    ) {
      return enableWithVersion(lastWallet)
    }
  }

  const defaultWallet = await sn.getDefaultWallet()
  if (modalMode === "neverAsk") {
    if (
      defaultWallet &&
      preAuthorizedWallets.some((w) => w.id === defaultWallet.id)
    ) {
      return enableWithVersion(defaultWallet)
    }

    if (preAuthorizedWallets.length === 1) {
      return enableWithVersion(preAuthorizedWallets[0])
    }

    return null
  }

  const installedWallets = await sn.getAvailableWallets(restOptions)
  if (modalMode === "canAsk" && installedWallets.length === 1) {
    return enableWithVersion(installedWallets[0])
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
    defaultWallet,
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
