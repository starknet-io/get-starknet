import { WalletProvider } from "./discovery"
import { IStorageWrapper } from "./localStorageStore"
import { ensureKeysArray } from "./utils"
import { FilterList } from "./wallet/filter"
import { Sort } from "./wallet/sort"
import type {
  RequestAccountsParameters,
  StarknetWindowObject,
} from "@starknet-io/types-js"

export type {
  BrowserStoreVersion,
  OperatingSystemStoreVersion,
  WalletProvider,
} from "./discovery"

export interface GetStarknetOptions {
  windowObject: Record<string, any>
  isWalletObject: (wallet: unknown) => boolean
  storageFactoryImplementation: (name: string) => IStorageWrapper
}

export interface GetWalletOptions {
  sort?: Sort
  include?: FilterList
  exclude?: FilterList
}

export interface DisconnectOptions {
  clearLastWallet?: boolean
}

export interface VirtualWallet {
  id: string
  name: string
  icon: string
  windowKey: string
  loadWallet: (
    windowObject: Record<string, unknown>,
  ) => Promise<StarknetWindowObject>
  hasSupport: (windowObject: Record<string, unknown>) => Promise<boolean>
}

export interface EvmWallet {
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void,
  ) => void
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void,
  ) => void
  request: (request: {
    method: string
    params?: Array<unknown>
  }) => Promise<unknown>
}

export const virtualWalletKeys = ensureKeysArray<VirtualWallet>({
  id: true,
  name: true,
  icon: true,
  windowKey: true,
  loadWallet: true,
  hasSupport: true,
})

export const fullWalletKeys = ensureKeysArray<StarknetWindowObject>({
  id: true,
  name: true,
  version: true,
  icon: true,
  request: true,
  on: true,
  off: true,
})

export const evmWalletKeys = ensureKeysArray<EvmWallet>({
  sendAsync: true,
  send: true,
  request: true,
})

export interface GetStarknetResult {
  getAvailableWallets: (
    options?: GetWalletOptions,
  ) => Promise<StarknetWindowObject[]> // Returns all wallets available in the window object
  getAuthorizedWallets: (
    options?: GetWalletOptions,
  ) => Promise<StarknetWindowObject[]> // Returns only preauthorized wallets available in the window object
  getDiscoveryWallets: (options?: GetWalletOptions) => Promise<WalletProvider[]> // Returns all wallets in existence (from discovery file)
  getLastConnectedWallet: () => Promise<StarknetWindowObject | null | undefined> // Returns the last wallet connected when it's still connected
  discoverVirtualWallets: () => Promise<void> // Discovers the virtual wallets by calling their hasSupport methods
  enable: (
    wallet: StarknetWindowObject | VirtualWallet,
    options?: RequestAccountsParameters,
  ) => Promise<StarknetWindowObject> // Connects to a wallet
  disconnect: (options?: DisconnectOptions) => Promise<void> // Disconnects from a wallet
}

declare global {
  interface Window {
    [key: string]: unknown
  }
}
