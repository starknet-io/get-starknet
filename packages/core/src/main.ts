import {
  ConnectedStarknetWindowObject,
  StarknetWindowObject,
} from "./StarknetWindowObject"
import {
  ExtensionWalletProvider,
  WebWalletProvider,
  wWallets,
  xWallets,
} from "./discovery"
import { IStorageWrapper, LocalStorageWrapper } from "./localStorageStore"
import { pipe } from "./utils"
import { FilterList, filterBy, filterByPreAuthorized } from "./wallet/filter"
import { isWalletObj } from "./wallet/isWalletObject"
import { scanObjectForWallets } from "./wallet/scan"
import { Sort, sortBy } from "./wallet/sort"
import { getWebWalletStarknetObject } from "./webwallet/webWalletObject"

export type {
  AccountChangeEventHandler,
  AddStarknetChainParameters,
  ConnectedStarknetWindowObject,
  NetworkChangeEventHandler,
  RpcMessage,
  StarknetWindowObject,
  SwitchStarknetChainParameter,
  WalletEvents,
  WatchAssetParameters,
} from "./StarknetWindowObject"
export type { WebWalletProvider, ExtensionWalletProvider } from "./discovery"

export interface GetStarknetOptions {
  windowObject: Record<string, any>
  isWalletObject: (wallet: any) => boolean
  storageFactoryImplementation: (name: string) => IStorageWrapper
}

const ssrSafeWindow = typeof window !== "undefined" ? window : {}

const defaultOptions: GetStarknetOptions = {
  windowObject: ssrSafeWindow,
  isWalletObject: isWalletObj,
  storageFactoryImplementation: (name: string) => new LocalStorageWrapper(name),
}

export interface GetWalletOptions {
  sort?: Sort
  include?: FilterList
  exclude?: FilterList
}

export interface DisconnectOptions {
  clearLastWallet?: boolean
}

interface GetStarknetResult {
  getInjectedWallets: (
    options?: GetWalletOptions,
  ) => Promise<StarknetWindowObject[]> // Returns all wallets available in the window object
  getWebWallets: (options?: GetWalletOptions) => Promise<WebWalletProvider[]> // Return all available web wallets
  getExtensionWallets: (
    options?: GetWalletOptions,
  ) => Promise<ExtensionWalletProvider[]> // Return all available extension wallets
  openWebWallet: (
    wwp: WebWalletProvider,
  ) => Promise<StarknetWindowObject | null | undefined> //// Connect with a web wallet to get StarknetWindowOject
  connect: (
    wallet: StarknetWindowObject,
    options?: {
      starknetVersion?: "v3" | "v4"
    },
  ) => Promise<ConnectedStarknetWindowObject> // Connects to a wallet
  disconnect: (options?: DisconnectOptions) => Promise<void> // Disconnects from a wallet
  getPreAuthorizedWallets: (
    options?: GetWalletOptions,
  ) => Promise<StarknetWindowObject[]> // Returns only preauthorized wallets available in the window object
  getLastConnectedWallet: () => Promise<StarknetWindowObject | null | undefined> // Returns the last wallet connected when it's still connected
}

export function getStarknet(
  options: Partial<GetStarknetOptions> = {},
): GetStarknetResult {
  const { storageFactoryImplementation, windowObject, isWalletObject } = {
    ...defaultOptions,
    ...options,
  }
  const lastConnectedStore = storageFactoryImplementation("gsw-last")

  return {
    getInjectedWallets: async (options = {}) => {
      const availableWallets = scanObjectForWallets(
        windowObject,
        isWalletObject,
      )
      return pipe<StarknetWindowObject[]>(
        (_) => filterBy(_, options),
        (_) => sortBy(_, options.sort),
      )(availableWallets)
    },
    getWebWallets: async (options = {}) => {
      return pipe<WebWalletProvider[]>(
        (_) => filterBy(_, options),
        (_) => sortBy(_, options.sort),
      )(wWallets)
    },
    getExtensionWallets: async (options = {}) => {
      return pipe<ExtensionWalletProvider[]>(
        (_) => filterBy(_, options),
        (_) => sortBy(_, options.sort),
      )(xWallets)
    },
    openWebWallet: async (w: WebWalletProvider) => {
      const wallet = await getWebWalletStarknetObject(w)
      return wallet
    },
    connect: async (wallet, options) => {
      await wallet.enable(options)
      if (!wallet.isConnected) {
        throw new Error("Failed to connect to wallet")
      }
      lastConnectedStore.set(wallet.id)
      return wallet
    },
    disconnect: async ({ clearLastWallet } = {}) => {
      if (clearLastWallet) {
        lastConnectedStore.delete()
      }
    },
    getPreAuthorizedWallets: async (options = {}) => {
      const availableWallets = scanObjectForWallets(
        windowObject,
        isWalletObject,
      )
      return pipe<StarknetWindowObject[]>(
        (_) => filterByPreAuthorized(_),
        (_) => filterBy(_, options),
        (_) => sortBy(_, options.sort),
      )(availableWallets)
    },
    getLastConnectedWallet: async () => {
      const lastConnectedWalletId = lastConnectedStore.get()
      const allWallets = scanObjectForWallets(windowObject, isWalletObject)
      const lastConnectedWallet = allWallets.find(
        (w) => w.id === lastConnectedWalletId,
      )
      const [firstPreAuthorizedWallet] = await filterByPreAuthorized(
        lastConnectedWallet ? [lastConnectedWallet] : [],
      )

      if (!firstPreAuthorizedWallet) {
        lastConnectedStore.delete()
        return null
      }

      return firstPreAuthorizedWallet
    },
  }
}

export default getStarknet()
