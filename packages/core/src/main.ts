import type {
  ConnectedStarknetWindowObject,
  RequestAccountsParameters,
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
  SwitchStarknetChainParameters,
  WalletEvents,
  WatchAssetParameters,
  DisconnectedStarknetWindowObject,
  IStarknetWindowObject,
  RequestAccountsParameters,
  AddDeclareTransactionParameters,
  AddDeclareTransactionResult,
  AddDeployAccountTransactionParameters,
  AddDeployAccountTransactionResult,
  AddInvokeTransactionParameters,
  AddInvokeTransactionResult,
  TypedData,
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
    options?: RequestAccountsParameters,
  ) => Promise<ConnectedStarknetWindowObject> // Connects to a wallet
  disconnect: (options?: DisconnectOptions) => Promise<void> // Disconnects from a wallet
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
    enable: async (wallet, options) => {
      await wallet.request({ type: "wallet_requestAccounts", params: options })
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
  }
}

export default getStarknet()
