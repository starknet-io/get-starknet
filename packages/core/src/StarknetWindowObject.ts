import type { AccountInterface, ProviderInterface } from "starknet"

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

interface IStarknetWindowObject {
  id: string
  name: string
  version: string
  icon: string
  request: <T extends RpcMessage>(
    call: Omit<T, "result">,
  ) => Promise<T["result"]>
  enable: (options?: { starknetVersion?: "v3" | "v4" }) => Promise<string[]>
  isPreauthorized: () => Promise<boolean>
  on: <E extends WalletEvents>(
    event: E["type"],
    handleEvent: E["handler"],
  ) => void
  off: <E extends WalletEvents>(
    event: E["type"],
    handleEvent: E["handler"],
  ) => void
  account?: AccountInterface
  provider?: ProviderInterface
  selectedAddress?: string
  chainId?: string
}

export interface ConnectedStarknetWindowObject extends IStarknetWindowObject {
  isConnected: true
  account: AccountInterface
  provider: ProviderInterface
  selectedAddress: string
  chainId: string
}

interface DisconnectedStarknetWindowObject extends IStarknetWindowObject {
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
