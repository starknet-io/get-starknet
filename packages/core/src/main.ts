import {
  ConnectedStarknetWindowObject,
  StarknetWindowObject,
} from "./StarknetWindowObject"
import discovery, { WalletProvider } from "./discovery"
import { IStorageWrapper, LocalStorageWrapper } from "./localStorageStore"
import { pipe } from "./utils"
import { FilterList, filterBy, filterByPreAuthorized } from "./wallet/filter"
import { isWalletObj } from "./wallet/isWalletObject"
import { scanObjectForWallets } from "./wallet/scan"
import { Sort, sortBy } from "./wallet/sort"

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
export type { WalletProvider } from "./discovery"

export interface GetStarknetOptions {
  windowObject: Record<string, any>
  isWalletObject: (wallet: any) => boolean
  storageFactoryImplementation: (name: string) => IStorageWrapper
}

const defaultOptions: GetStarknetOptions = {
  windowObject: window,
  isWalletObject: isWalletObj,
  storageFactoryImplementation: (name: string) => new LocalStorageWrapper(name),
}

export interface GetWalletOptions {
  sort?: Sort
  include?: FilterList
  exclude?: FilterList
}

interface GetStarknetResult {
  getAvailableWallets: (
    options?: GetWalletOptions,
  ) => Promise<StarknetWindowObject[]> // Returns all wallets available in the window object
  getPreAuthorizedWallets: (
    options?: GetWalletOptions,
  ) => Promise<StarknetWindowObject[]> // Returns only preauthorized wallets available in the window object
  getDiscoveryWallets: (options?: GetWalletOptions) => Promise<WalletProvider[]> // Returns all wallets in existence (from discovery file)
  getLastConnectedWallet: () => Promise<StarknetWindowObject | null | undefined> // Returns the last wallet connected when it's still connected
  getDefaultWallet: () => Promise<StarknetWindowObject | null | undefined> // Returns the default wallet
  enable: (
    wallet: StarknetWindowObject,
    options?: {
      starknetVersion?: "v3" | "v4"
    },
  ) => Promise<ConnectedStarknetWindowObject> // Connects to a wallet
  disconnect: (options?: { clearDefaultWallet?: boolean }) => Promise<void> // Disconnects from a wallet
}

export function getStarknet(
  options: Partial<GetStarknetOptions> = {},
): GetStarknetResult {
  const { storageFactoryImplementation, windowObject, isWalletObject } = {
    ...defaultOptions,
    ...options,
  }
  const lastConnectedStore = storageFactoryImplementation("gsw-last")
  const defaultWalletStore = storageFactoryImplementation("gsw-default")

  return {
    getAvailableWallets: async (options = {}) => {
      const availableWallets = scanObjectForWallets(
        windowObject,
        isWalletObject,
      )
      return pipe<StarknetWindowObject[]>(
        (_) => filterBy(_, options),
        (_) => sortBy(_, options.sort),
      )(availableWallets)
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
    getDiscoveryWallets: async (options = {}) => {
      return pipe<WalletProvider[]>(
        (_) => filterBy(_, options),
        (_) => sortBy(_, options.sort),
      )(discovery)
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
    getDefaultWallet: async () => {
      const defaultWalletId = defaultWalletStore.get()
      const allWallets = scanObjectForWallets(windowObject, isWalletObject)
      const defaultWallet = allWallets.find((w) => w.id === defaultWalletId)
      const [firstPreAuthorizedWallet] = await filterByPreAuthorized(
        defaultWallet ? [defaultWallet] : [],
      )

      if (!firstPreAuthorizedWallet) {
        defaultWalletStore.delete()
        return null
      }

      return firstPreAuthorizedWallet
    },
    enable: async (wallet, options) => {
      await wallet.enable(options)
      if (!wallet.isConnected) {
        throw new Error("Failed to connect to wallet")
      }
      if (!defaultWalletStore.get()) {
        defaultWalletStore.set(wallet.id)
      }
      lastConnectedStore.set(wallet.id)
      return wallet
    },
    disconnect: async ({ clearDefaultWallet } = {}) => {
      lastConnectedStore.delete()
      if (clearDefaultWallet) {
        defaultWalletStore.delete()
      }
    },
  }
}

export default getStarknet()
