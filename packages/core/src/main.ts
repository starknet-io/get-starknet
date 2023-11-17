import {
  ConnectedStarknetWindowObject,
  StarknetWindowObject,
} from "./StarknetWindowObject"
import discovery, { WalletProvider } from "./discovery"
import { IStorageWrapper, LocalStorageWrapper } from "./localStorageStore"
import { pipe } from "./utils"
import { FilterList, filterBy, filterByPreAuthorized } from "./wallet/filter"
import { isWalletObj } from "./wallet/isWalletObject"
import { MetaMaskSnapWallet } from "./wallet/metamask_snap"
import { MetaMaskSnap } from "./wallet/metamask_snap/snap"
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
  DisconnectedStarknetWindowObject,
  IStarknetWindowObject,
} from "./StarknetWindowObject"
export type { WalletProvider } from "./discovery"

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

async function getFilteredAndSortedWallets(
  windowObject: Record<string, any>,
  isWalletObject: (wallet: any) => boolean,
  options: GetWalletOptions,
): Promise<StarknetWindowObject[]> {
  await injectMetamaskSnapWallet(windowObject)
  const availableWallets = scanObjectForWallets(windowObject, isWalletObject)
  return pipe<StarknetWindowObject[]>(
    (_) => filterByPreAuthorized(_),
    (_) => filterBy(_, options),
    (_) => sortBy(_, options.sort),
  )(availableWallets)
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
  getAvailableWallets: (
    options?: GetWalletOptions,
  ) => Promise<StarknetWindowObject[]> // Returns all wallets available in the window object
  getPreAuthorizedWallets: (
    options?: GetWalletOptions,
  ) => Promise<StarknetWindowObject[]> // Returns only preauthorized wallets available in the window object
  getDiscoveryWallets: (options?: GetWalletOptions) => Promise<WalletProvider[]> // Returns all wallets in existence (from discovery file)
  getLastConnectedWallet: () => Promise<StarknetWindowObject | null | undefined> // Returns the last wallet connected when it's still connected
  enable: (
    wallet: StarknetWindowObject,
    options?: {
      starknetVersion?: "v4" | "v5"
    },
  ) => Promise<ConnectedStarknetWindowObject> // Connects to a wallet
  disconnect: (options?: DisconnectOptions) => Promise<void> // Disconnects from a wallet
}

export async function injectMetamaskSnapWallet(
  windowObject: Record<string, any>,
) {
  if (windowObject && windowObject.hasOwnProperty("starknet_metamask")) {
    return
  }
  const provider = await MetaMaskSnap.GetProvider(windowObject)
  if (provider) {
    const metaMaskSnapWrapper = new MetaMaskSnapWallet(provider)
    windowObject["starknet_metamask"] = metaMaskSnapWrapper
  }
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
    getAvailableWallets: async (options = {}) => {
      return getFilteredAndSortedWallets(windowObject, isWalletObject, options)
    },
    getPreAuthorizedWallets: async (options = {}) => {
      return getFilteredAndSortedWallets(windowObject, isWalletObject, options)
    },
    getDiscoveryWallets: async (options = {}) => {
      await injectMetamaskSnapWallet(windowObject)
      return pipe<WalletProvider[]>(
        (_) => filterBy(_, options),
        (_) => sortBy(_, options.sort),
      )(discovery)
    },
    getLastConnectedWallet: async () => {
      await injectMetamaskSnapWallet(windowObject)
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
    enable: async (wallet, options) => {
      try {
        await wallet.enable(options ?? { starknetVersion: "v5" })
        if (!wallet.isConnected) {
          throw new Error("Failed to connect to wallet")
        }
        lastConnectedStore.set(wallet.id)
        return wallet
      } catch (error) {
        console.error("Error connecting to wallet:", error)
        throw error
      }
    },
    disconnect: async ({ clearLastWallet } = {}) => {
      if (clearLastWallet) {
        lastConnectedStore.delete()
      }
    },
  }
}

export default getStarknet()
