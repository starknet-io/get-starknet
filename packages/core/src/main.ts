import discovery, { type WalletProvider } from "./discovery"
import { LocalStorageWrapper } from "./localStorageStore"
import type { GetStarknetOptions, GetStarknetResult } from "./types"
import { pipe, ssrSafeWindow } from "./utils"
import {
  EVMWalletInfo,
  EVMWalletProvider,
  detectEVMSupport,
} from "./wallet/EVMWalletBridge"
import { filterBy, filterByAuthorized } from "./wallet/filter"
import {
  isEvmWallet,
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

  let evmWallets: {
    provider: EVMWalletProvider | null
    info: EVMWalletInfo | null
  }[]

  async function isEVMAvailable() {
    evmWallets = await detectEVMSupport(windowObject)
  }

  isEVMAvailable()

  return {
    getAvailableWallets: async (options = {}) => {
      const availableWallets = scanObjectForWallets(
        windowObject,
        isWalletObject,
      )

      evmWallets.forEach((evmWallet) => {
        if (evmWallet.provider && evmWallet.info) {
          availableWallets.push({
            ...evmWallet.provider,
            id: evmWallet.info.name,
            name: evmWallet.info.name,
            icon: evmWallet.info.icon,
            version: evmWallet.info.icon,
            on: evmWallet.provider.on,
            off: evmWallet.provider.off,
          })
        }
      })

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
      } else if (isEvmWallet(inputWallet)) {
        // Get all detected EVM wallets
        const evmWallets = await detectEVMSupport(windowObject)

        // Find the matching wallet in the detected list
        const selectedWallet = evmWallets.find(
          ({ info }) => info && info.name === inputWallet.name,
        )

        if (selectedWallet && selectedWallet.provider) {
          wallet = selectedWallet.provider
        } else {
          throw new Error("Failed to connect to the selected EVM wallet")
        }
      } else if (isFullWallet(inputWallet)) {
        wallet = inputWallet
      } else {
        throw new Error("Invalid wallet object")
      }

      if (isEvmWallet(wallet)) {
        await wallet.request({ method: "eth_requestAccounts" })
      } else {
        await wallet.request({
          type: "wallet_requestAccounts",
          params: {
            silent_mode: options?.silent_mode,
          },
        })
      }

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
