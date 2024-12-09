import discovery, { type WalletProvider } from "./discovery"
import { LocalStorageWrapper } from "./localStorageStore"
import type { GetStarknetOptions, GetStarknetResult } from "./types"
import { pipe, ssrSafeWindow } from "./utils"
import { filterBy, filterByAuthorized } from "./wallet/filter"
import {
  isFullWallet,
  isVirtualWallet,
  isWalletObject,
} from "./wallet/isWalletObject"
import { scanObjectForWallets } from "./wallet/scan"
import { sortBy } from "./wallet/sort"
import {
  initiateVirtualWallets,
  resolveVirtualWallet,
  virtualWallets,
} from "./wallet/virtualWallets"
import { Permission, type StarknetWindowObject } from "@starknet-io/types-js"

export type {
  StarknetWindowObject,
  AddDeclareTransactionParameters,
  AddDeclareTransactionResult,
  AddInvokeTransactionParameters,
  AddInvokeTransactionResult,
  AddStarknetChainParameters,
  RequestAccountsParameters,
  SwitchStarknetChainParameters,
  AccountDeploymentData,
  WatchAssetParameters,
  TypedData,
  RequestFn,
  RpcMessage,
  IsParamsOptional,
  RpcTypeToMessageMap,
  RequestFnCall,
  AccountChangeEventHandler,
  NetworkChangeEventHandler,
  WalletEventHandlers,
  WalletEvents,
} from "@starknet-io/types-js"

export { scanObjectForWallets } from "./wallet/scan"
export { isWalletObject } from "./wallet/isWalletObject"

export type {
  BrowserStoreVersion,
  DisconnectOptions,
  GetStarknetOptions,
  GetStarknetResult,
  GetWalletOptions,
  OperatingSystemStoreVersion,
  WalletProvider,
} from "./types"

export { ssrSafeWindow } from "./utils"

const defaultOptions: GetStarknetOptions = {
  windowObject: ssrSafeWindow ?? {},
  isWalletObject,
  storageFactoryImplementation: (name: string) => new LocalStorageWrapper(name),
}

export function getStarknet(
  options: Partial<GetStarknetOptions> = {},
): GetStarknetResult {
  const { storageFactoryImplementation, windowObject, isWalletObject } = {
    ...defaultOptions,
    ...options,
  }
  const lastConnectedStore = storageFactoryImplementation("gsw-last")

  initiateVirtualWallets(windowObject)

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
    getAuthorizedWallets: async (options = {}) => {
      const availableWallets = scanObjectForWallets(
        windowObject,
        isWalletObject,
      )
      return pipe<StarknetWindowObject[]>(
        (_) => filterByAuthorized(_),
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
      const [firstAuthorizedWallet] = await filterByAuthorized(
        lastConnectedWallet ? [lastConnectedWallet] : [],
      )

      if (!firstAuthorizedWallet) {
        lastConnectedStore.delete()
        return null
      }

      return firstAuthorizedWallet
    },
    discoverVirtualWallets: async (
      walletNamesOrIds: string[] = [],
    ): Promise<void> => {
      const walletNamesOrIdsSet = new Set(walletNamesOrIds)

      const virtualWalletToDiscover =
        walletNamesOrIdsSet.size > 0
          ? virtualWallets.filter(
              (virtualWallet) =>
                walletNamesOrIdsSet.has(virtualWallet.name) ||
                walletNamesOrIdsSet.has(virtualWallet.id),
            )
          : virtualWallets

      await Promise.all(
        virtualWalletToDiscover.map(async (virtualWallet) => {
          const hasSupport = await virtualWallet.hasSupport(windowObject)
          if (hasSupport) {
            windowObject[virtualWallet.windowKey] = virtualWallet
          }
        }),
      )
    },
    enable: async (inputWallet, options) => {
      let wallet: StarknetWindowObject
      if (isVirtualWallet(inputWallet)) {
        wallet = await resolveVirtualWallet(windowObject, inputWallet)
      } else if (isFullWallet(inputWallet)) {
        wallet = inputWallet
      } else {
        throw new Error("Invalid wallet object")
      }

      await wallet.request({
        type: "wallet_requestAccounts",
        params: {
          silent_mode: options?.silent_mode,
        },
      })

      // check for permissions
      const permissions: Permission[] = await wallet.request({
        type: "wallet_getPermissions",
      })
      if (!permissions?.includes(Permission.ACCOUNTS)) {
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
