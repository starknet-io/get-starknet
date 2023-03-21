import {
  AddStarknetChainParameters,
  SwitchStarknetChainParameter,
  WatchAssetParameters,
} from "../StarknetWindowObject"
import { ChildApi } from "./connection"
import { AsyncMethodReturns } from "penpal"

export async function handleAddTokenRequest(
  child: AsyncMethodReturns<ChildApi>,
  callParams: WatchAssetParameters,
): Promise<boolean> {
  return await child.addToken(callParams)
}

export async function handleAddNetworkRequest(
  child: AsyncMethodReturns<ChildApi>,
  callParams: AddStarknetChainParameters,
): Promise<boolean> {
  return await child.addNetwork(callParams)
}

export async function handleSwitchNetworkRequest(
  child: AsyncMethodReturns<ChildApi>,
  callParams: SwitchStarknetChainParameter,
): Promise<boolean> {
  return await child.switchNetwork(callParams)
}
