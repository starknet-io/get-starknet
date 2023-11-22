import type { AccountInterface, ProviderInterface } from "starknet"
import type {
  AccountInterface as AccountInterfaceV4,
  ProviderInterface as ProviderInterfaceV4,
} from "starknet4"

export type AccountChangeEventHandler = (accounts: string[]) => void

export type NetworkChangeEventHandler = (network?: string) => void

export type WalletEvents =
  | {
      type: "accountsChanged"
      handler: AccountChangeEventHandler
    }
  | {
      type: "networkChanged"
      handler: NetworkChangeEventHandler
    }

// EIP-747:
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-747.md
export interface WatchAssetParameters {
  type: "ERC20" // The asset's interface, e.g. 'ERC20'
  options: {
    address: string // The hexadecimal StarkNet address of the token contract
    symbol?: string // A ticker symbol or shorthand, up to 5 alphanumerical characters
    decimals?: number // The number of asset decimals
    image?: string // A string url of the token logo
    name?: string // The name of the token - not in spec
  }
}

// EIP-3085
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3085.md

export interface AddStarknetChainParameters {
  id: string
  chainId: string // A 0x-prefixed hexadecimal string
  chainName: string
  baseUrl: string
  rpcUrls?: string[]
  blockExplorerUrls?: string[]

  nativeCurrency?: {
    address: string // Not part of the standard, but required by StarkNet as it can work with any ERC20 token as the fee token
    name: string
    symbol: string // 2-6 characters long
    decimals: number
  } // Currently ignored.
  iconUrls?: string[] // Currently ignored.
}

export interface SwitchStarknetChainParameter {
  chainId: string // A 0x-prefixed hexadecimal string
}

// SNIP: https://community.starknet.io/t/snip-deployment-interface-between-dapps-and-wallets/101923
interface GetDeploymentDataResult {
  address: string // Represented as 'felt252'
  class_hash: string // Represented as 'felt252'
  salt: string // Represented as 'felt252'
  calldata: string[] // Array of 'felt252', length := calldata_len
  sigdata?: string[] // Array of 'felt252', should be prepended to signature as extra data
}

export type RpcMessage =
  | {
      type: "wallet_watchAsset"
      params: WatchAssetParameters
      result: boolean
    }
  | {
      type: "wallet_addStarknetChain"
      params: AddStarknetChainParameters
      result: boolean
    }
  | {
      type: "wallet_switchStarknetChain"
      params: SwitchStarknetChainParameter
      result: boolean
    }
  | {
      type: "wallet_deploymentData"
      params: never
      result: GetDeploymentDataResult
    }

export interface IStarknetWindowObject {
  id: string
  name: string
  version: string
  icon: string
  request: <T extends RpcMessage>(
    call: Omit<T, "result">,
  ) => Promise<T["result"]>
  enable: (options?: { starknetVersion?: "v4" | "v5" }) => Promise<string[]>
  isPreauthorized: () => Promise<boolean>
  on: <E extends WalletEvents>(
    event: E["type"],
    handleEvent: E["handler"],
  ) => void
  off: <E extends WalletEvents>(
    event: E["type"],
    handleEvent: E["handler"],
  ) => void
  account?: AccountInterface | AccountInterfaceV4
  provider?: ProviderInterface | ProviderInterfaceV4
  selectedAddress?: string
  chainId?: string
}

export interface ConnectedStarknetWindowObject extends IStarknetWindowObject {
  isConnected: true
  account: AccountInterface | AccountInterfaceV4
  provider: ProviderInterface | ProviderInterfaceV4
  selectedAddress: string
  chainId: string
}

export interface DisconnectedStarknetWindowObject
  extends IStarknetWindowObject {
  isConnected: false
}

export type StarknetWindowObject =
  | ConnectedStarknetWindowObject
  | DisconnectedStarknetWindowObject

declare global {
  interface Window {
    starknet?: StarknetWindowObject
    starknet_braavos?: StarknetWindowObject
    starknet_argentX?: StarknetWindowObject
    [key: `starknet_${string}`]: StarknetWindowObject | undefined
  }
}
