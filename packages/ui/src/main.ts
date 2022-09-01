import show, { type WalletProviderWithStoreVersion } from "./modal"
import Bowser from "bowser"
import sn, { type StarknetWindowObject } from "get-starknet-core"

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

export interface ConnectOptions {
  modalMode?: "alwaysAsk" | "canAsk" | "neverAsk"
  modalTheme?: "light" | "dark" | "system"
  storeVersion?: StoreVersion
}

export interface DisconnectOptions {
  clearDefaultWallet?: boolean
}

export const connect = async ({
  modalMode = "canAsk",
  storeVersion = getStoreVersionFromBrowser(),
  modalTheme,
}: ConnectOptions = {}): Promise<StarknetWindowObject | null> => {
  const enableWithVersion = async (wallet: StarknetWindowObject | null) => {
    if (!wallet) {
      return null
    }
    return sn.enable(wallet, { starknetVersion: "v4" }).catch(() => null)
  }

  const lastWallet = await sn.getLastConnectedWallet()
  if (modalMode !== "alwaysAsk" && lastWallet) {
    return enableWithVersion(lastWallet)
  }

  const preAuthorizedWallets = await sn.getPreAuthorizedWallets({
    exclude: [lastWallet?.id],
  })
  if (modalMode === "neverAsk" && preAuthorizedWallets.length === 1) {
    return enableWithVersion(preAuthorizedWallets[0])
  }

  const defaultWallet = await sn.getDefaultWallet()
  // show default wallet as first entry, but only autoconnect if modalMode is neverAsk and preauthorized
  const preAuthorizedWalletsWithoutDefaultWallet = preAuthorizedWallets.filter(
    (wallet) => wallet.id !== defaultWallet?.id,
  )
  if (
    modalMode === "neverAsk" &&
    defaultWallet &&
    preAuthorizedWallets.some((w) => w.id === defaultWallet.id)
  ) {
    return enableWithVersion(defaultWallet)
  }

  const installedWallets = await sn.getAvailableWallets({
    exclude: [lastWallet?.id, ...preAuthorizedWallets.map((w) => w.id)],
  })
  if (modalMode === "canAsk" && installedWallets.length === 1) {
    return enableWithVersion(installedWallets[0])
  }

  if (modalMode === "neverAsk") {
    return null
  }

  const discoveryWallets = await sn.getDiscoveryWallets({
    exclude: [
      lastWallet?.id,
      ...preAuthorizedWallets.map((w) => w.id),
      ...installedWallets.map((w) => w.id),
    ],
  })

  const discoveryWalletsByStoreVersion: WalletProviderWithStoreVersion[] =
    discoveryWallets
      .filter((w) => Boolean(w.downloads[storeVersion]))
      .map(({ downloads, ...w }) => ({
        ...w,
        download: downloads[storeVersion],
      }))

  return show({
    lastWallet,
    defaultWallet: defaultWallet?.id !== lastWallet?.id ? defaultWallet : null,
    preAuthorizedWallets: preAuthorizedWalletsWithoutDefaultWallet,
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
