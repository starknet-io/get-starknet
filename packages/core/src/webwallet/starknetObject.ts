import type {
  AccountChangeEventHandler,
  AddStarknetChainParameters,
  ConnectedStarknetWindowObject,
  NetworkChangeEventHandler,
  StarknetWindowObject,
  SwitchStarknetChainParameter,
  WalletEvents,
  WatchAssetParameters,
} from "../StarknetWindowObject"
import { MessageAccount } from "./account"
import { ChildApi } from "./connection"
import {
  handleAddNetworkRequest,
  handleAddTokenRequest,
  handleSwitchNetworkRequest,
} from "./requestHandlers"
import type { AsyncMethodReturns } from "penpal"
import { constants } from "starknet"
import { Provider } from "starknet"

interface network {
  name: string
  chainid: constants.StarknetChainId
  starknetProvider: string
}

const networks: Array<network> = [
  {
    name: "SN_MAIN",
    chainid: constants.StarknetChainId.MAINNET,
    starknetProvider: "mainnet-alpha",
  },
  {
    name: "SN_GOERLI",
    chainid: constants.StarknetChainId.TESTNET,
    starknetProvider: "goerli-alpha",
  },
  {
    name: "SN_GOERLI2",
    chainid: constants.StarknetChainId.TESTNET2,
    starknetProvider: "goerli-alpha-2",
  },
]

export interface StarknetConnectedObjectOption {
  id: string
  icon: string
  name: string
  version: string
}

export const userEventHandlers: WalletEvents[] = []

function updateStarknetConnectedObject(
  snObject: StarknetWindowObject,
  walletAddress: string,
  chainID: constants.StarknetChainId,
  child: AsyncMethodReturns<ChildApi>,
): ConnectedStarknetWindowObject {
  if (snObject.isConnected) {
    return snObject
  }

  const provider = new Provider({
    sequencer: {
      network:
        networks.find((n) => n.chainid === chainID)?.chainid ??
        constants.StarknetChainId.MAINNET,
    },
  })

  const valuesToAssign: Pick<
    ConnectedStarknetWindowObject,
    "isConnected" | "chainId" | "selectedAddress" | "account" | "provider"
  > = {
    isConnected: true,
    chainId: provider.chainId,
    selectedAddress: walletAddress,
    account: new MessageAccount(provider, walletAddress, child),
    provider,
  }
  return Object.assign(snObject, valuesToAssign)
}

export const getStarknetConnectedObject = (
  options: StarknetConnectedObjectOption,
  child: AsyncMethodReturns<ChildApi>,
): StarknetWindowObject => {
  const starknet: StarknetWindowObject = {
    ...options,
    isConnected: false,
    request: async (call) => {
      if (call.type === "wallet_watchAsset" && call.params.type === "ERC20") {
        return await handleAddTokenRequest(
          child,
          call.params as WatchAssetParameters,
        )
      } else if (call.type === "wallet_addStarknetChain") {
        return await handleAddNetworkRequest(
          child,
          call.params as AddStarknetChainParameters,
        )
      } else if (call.type === "wallet_switchStarknetChain") {
        return await handleSwitchNetworkRequest(
          child,
          call.params as SwitchStarknetChainParameter,
        )
      }
      throw Error("Not implemented")
    },
    enable: async (ops) => {
      if (ops?.starknetVersion === "v3") {
        throw Error("not implemented")
      }
      console.log("enable")

      const res = await child.enable()
      console.log("Address = " + res.address)
      console.log(
        "Network = " +
          networks.find((n) => n.chainid === res.chainid)?.starknetProvider,
      )
      updateStarknetConnectedObject(starknet, res.address, res.chainid, child)

      return [res.address]
    },
    isPreauthorized: async () => {
      return await child.isPreauthorized(window.location.host)
    },
    on: (event, handleEvent) => {
      if (event === "accountsChanged") {
        userEventHandlers.push({
          type: event,
          handler: handleEvent as AccountChangeEventHandler,
        })
      } else if (event === "networkChanged") {
        userEventHandlers.push({
          type: event,
          handler: handleEvent as NetworkChangeEventHandler,
        })
      } else {
        throw new Error(`Unknwown event: ${event}`)
      }
    },
    off: (event, handleEvent) => {
      if (event !== "accountsChanged" && event !== "networkChanged") {
        throw new Error(`Unknwown event: ${event}`)
      }

      const eventIndex = userEventHandlers.findIndex(
        (userEvent) =>
          userEvent.type === event && userEvent.handler === handleEvent,
      )
      if (eventIndex >= 0) {
        userEventHandlers.splice(eventIndex, 1)
      }
    },
  }
  return starknet
}
