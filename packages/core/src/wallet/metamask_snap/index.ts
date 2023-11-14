/// The adapter is supposed to wrap a metamask inject provider
/// and implement the  IStarknetWindowObject interface
import {
  AddStarknetChainParameters,
  IStarknetWindowObject,
  RpcMessage,
  SwitchStarknetChainParameter,
  WalletEvents,
  WatchAssetParameters,
} from "../../StarknetWindowObject"
import { MetaMaskAccount } from "./accounts"
import { CHAIN_ID_TESTNET } from "./constants"
import { MetaMaskSigner } from "./signer"
import { MetaMaskSnap } from "./snap"
import { ChainId, RequestSnapResponse } from "./types"
import {
  AccContract,
  Network,
} from "@consensys/starknet-snap/src/types/snapState"
import { MetaMaskInpageProvider } from "@metamask/providers"
import { AccountInterface, Provider, ProviderInterface } from "starknet"

export class MetaMaskSnapWallet implements IStarknetWindowObject {
  id: string
  name: string
  version: string
  icon: string
  metamaskProvider: MetaMaskInpageProvider
  account?: AccountInterface | undefined
  provider?: ProviderInterface | undefined
  selectedAddress?: string | undefined
  chainId?: string | undefined
  snapId: string
  isConnected?: boolean
  snap?: MetaMaskSnap

  constructor(metamaskProvider: MetaMaskInpageProvider) {
    this.id = "metamask"
    this.name = "Metamask"
    this.version = "v0.0.1"
    this.icon = `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIGlkPSJMYXllcl8xIiB4PSIwIiB5PSIwIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMTguNiAzMTguNiI+CiAgPHN0eWxlPgogICAgLnN0MSwuc3Q2e2ZpbGw6I2U0NzYxYjtzdHJva2U6I2U0NzYxYjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmR9LnN0NntmaWxsOiNmNjg1MWI7c3Ryb2tlOiNmNjg1MWJ9CiAgPC9zdHlsZT4KICA8cGF0aCBmaWxsPSIjZTI3NjFiIiBzdHJva2U9IiNlMjc2MWIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0ibTI3NC4xIDM1LjUtOTkuNSA3My45TDE5MyA2NS44eiIvPgogIDxwYXRoIGQ9Im00NC40IDM1LjUgOTguNyA3NC42LTE3LjUtNDQuM3ptMTkzLjkgMTcxLjMtMjYuNSA0MC42IDU2LjcgMTUuNiAxNi4zLTU1LjN6bS0yMDQuNC45TDUwLjEgMjYzbDU2LjctMTUuNi0yNi41LTQwLjZ6IiBjbGFzcz0ic3QxIi8+CiAgPHBhdGggZD0ibTEwMy42IDEzOC4yLTE1LjggMjMuOSA1Ni4zIDIuNS0yLTYwLjV6bTExMS4zIDAtMzktMzQuOC0xLjMgNjEuMiA1Ni4yLTIuNXpNMTA2LjggMjQ3LjRsMzMuOC0xNi41LTI5LjItMjIuOHptNzEuMS0xNi41IDMzLjkgMTYuNS00LjctMzkuM3oiIGNsYXNzPSJzdDEiLz4KICA8cGF0aCBmaWxsPSIjZDdjMWIzIiBzdHJva2U9IiNkN2MxYjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0ibTIxMS44IDI0Ny40LTMzLjktMTYuNSAyLjcgMjIuMS0uMyA5LjN6bS0xMDUgMCAzMS41IDE0LjktLjItOS4zIDIuNS0yMi4xeiIvPgogIDxwYXRoIGZpbGw9IiMyMzM0NDciIHN0cm9rZT0iIzIzMzQ0NyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJtMTM4LjggMTkzLjUtMjguMi04LjMgMTkuOS05LjF6bTQwLjkgMCA4LjMtMTcuNCAyMCA5LjF6Ii8+CiAgPHBhdGggZmlsbD0iI2NkNjExNiIgc3Ryb2tlPSIjY2Q2MTE2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Im0xMDYuOCAyNDcuNCA0LjgtNDAuNi0zMS4zLjl6TTIwNyAyMDYuOGw0LjggNDAuNiAyNi41LTM5Ljd6bTIzLjgtNDQuNy01Ni4yIDIuNSA1LjIgMjguOSA4LjMtMTcuNCAyMCA5LjF6bS0xMjAuMiAyMy4xIDIwLTkuMSA4LjIgMTcuNCA1LjMtMjguOS01Ni4zLTIuNXoiLz4KICA8cGF0aCBmaWxsPSIjZTQ3NTFmIiBzdHJva2U9IiNlNDc1MWYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0ibTg3LjggMTYyLjEgMjMuNiA0Ni0uOC0yMi45em0xMjAuMyAyMy4xLTEgMjIuOSAyMy43LTQ2em0tNjQtMjAuNi01LjMgMjguOSA2LjYgMzQuMSAxLjUtNDQuOXptMzAuNSAwLTIuNyAxOCAxLjIgNDUgNi43LTM0LjF6Ii8+CiAgPHBhdGggZD0ibTE3OS44IDE5My41LTYuNyAzNC4xIDQuOCAzLjMgMjkuMi0yMi44IDEtMjIuOXptLTY5LjItOC4zLjggMjIuOSAyOS4yIDIyLjggNC44LTMuMy02LjYtMzQuMXoiIGNsYXNzPSJzdDYiLz4KICA8cGF0aCBmaWxsPSIjYzBhZDllIiBzdHJva2U9IiNjMGFkOWUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0ibTE4MC4zIDI2Mi4zLjMtOS4zLTIuNS0yLjJoLTM3LjdsLTIuMyAyLjIuMiA5LjMtMzEuNS0xNC45IDExIDkgMjIuMyAxNS41aDM4LjNsMjIuNC0xNS41IDExLTl6Ii8+CiAgPHBhdGggZmlsbD0iIzE2MTYxNiIgc3Ryb2tlPSIjMTYxNjE2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Im0xNzcuOSAyMzAuOS00LjgtMy4zaC0yNy43bC00LjggMy4zLTIuNSAyMi4xIDIuMy0yLjJoMzcuN2wyLjUgMi4yeiIvPgogIDxwYXRoIGZpbGw9IiM3NjNkMTYiIHN0cm9rZT0iIzc2M2QxNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJtMjc4LjMgMTE0LjIgOC41LTQwLjgtMTIuNy0zNy45LTk2LjIgNzEuNCAzNyAzMS4zIDUyLjMgMTUuMyAxMS42LTEzLjUtNS0zLjYgOC03LjMtNi4yLTQuOCA4LTYuMXpNMzEuOCA3My40bDguNSA0MC44LTUuNCA0IDggNi4xLTYuMSA0LjggOCA3LjMtNSAzLjYgMTEuNSAxMy41IDUyLjMtMTUuMyAzNy0zMS4zLTk2LjItNzEuNHoiLz4KICA8cGF0aCBkPSJtMjY3LjIgMTUzLjUtNTIuMy0xNS4zIDE1LjkgMjMuOS0yMy43IDQ2IDMxLjItLjRoNDYuNXptLTE2My42LTE1LjMtNTIuMyAxNS4zLTE3LjQgNTQuMmg0Ni40bDMxLjEuNC0yMy42LTQ2em03MSAyNi40IDMuMy01Ny43IDE1LjItNDEuMWgtNjcuNWwxNSA0MS4xIDMuNSA1Ny43IDEuMiAxOC4yLjEgNDQuOGgyNy43bC4yLTQ0Ljh6IiBjbGFzcz0ic3Q2Ii8+Cjwvc3ZnPg==",`
    this.snapId = "npm:@consensys/starknet-snap"
    this.metamaskProvider = metamaskProvider

    this.chainId = CHAIN_ID_TESTNET
  }

  async request<T extends RpcMessage>(
    call: Omit<T, "result">,
  ): Promise<T["result"]> {
    if (call.type === "wallet_switchStarknetChain") {
      const params = call as {
        type: "wallet_switchStarknetChain"
        params: SwitchStarknetChainParameter
      }

      const result = (await this.snap?.switchNetwork(params.params)) ?? false
      return result as T["result"]
    }

    if (call.type === "wallet_addStarknetChain") {
      const params = call as {
        type: "wallet_addStarknetChain"
        params: AddStarknetChainParameters
      }
      const result = (await this.snap?.addStarknetChain(params.params)) ?? false
      return result as T["result"]
    }

    if (call.type === "wallet_watchAsset") {
      const params = call as {
        type: "wallet_watchAsset"
        params: WatchAssetParameters
      }
      const result = (await this.snap?.watchAsset(params.params)) ?? false
      return result as T["result"]
    }

    throw new Error(`Method ${call.type} not implemented`)
  }

  async enable(
    options?: { starknetVersion?: "v4" | "v5" | undefined } | undefined,
  ) {
    const response = await this.metamaskProvider.request<RequestSnapResponse>({
      method: "wallet_requestSnaps",
      params: {
        [this.snapId]: {},
      },
    })

    if (typeof this.chainId === "undefined") {
      throw new Error("chain id is undefined")
    }

    if (!response) {
      throw new Error("the snap was not found")
    }

    const snapResponse = response[this.snapId]
    if (snapResponse && snapResponse.enabled) {
      //chainId should select by wallet, right now hardcoded
      const response = await this.recoverAccounts(this.chainId)

      if (!response) {
        throw new Error("can't recover accounts")
      }

      this.selectedAddress = response[0].address

      const networkInfo = await this.getNetworkInfo(this.chainId)
      if (!networkInfo) {
        throw Error(
          `can't find network info for network with ID ${this.chainId}`,
        )
      }

      //chainId should select by wallet, right now hardcoded
      this.provider = new Provider({
        rpc: {
          nodeUrl: networkInfo.nodeUrl,
        },
      })

      const snap = new MetaMaskSnap(
        this.snapId,
        this.chainId,
        this.metamaskProvider,
        this.selectedAddress,
      )

      const signer = new MetaMaskSigner(snap)
      this.account = new MetaMaskAccount(
        snap,
        this.provider,
        this.selectedAddress,
        signer,
        "0", //we should not hardcode
      )
      this.chainId = await this.provider.getChainId()
    }

    if (!this.selectedAddress) {
      throw new Error("")
    }

    return [this.selectedAddress]
  }

  async isPreauthorized() {
    return false
  }

  // This is better handled inside the snap itself
  on<E extends WalletEvents>(event: E["type"], handleEvent: E["handler"]) {
    // todo!()
    throw new Error("event handler is not implemented")
  }

  // This is better handled inside the snap itself
  off<E extends WalletEvents>(event: E["type"], handleEvent: E["handler"]) {
    // todo!()
    throw new Error("event handler is not implemented")
  }

  private async getNetworkInfo(chainId: ChainId): Promise<Network | undefined> {
    const response = (await this.metamaskProvider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.snapId,
        request: {
          method: "starkNet_getStoredNetworks",
          params: {},
        },
      },
    })) as unknown as Network[]

    let network = response.find((n) => {
      return n.chainId === chainId
    })

    return network
  }

  private async recoverAccounts(chainId: ChainId): Promise<Array<AccContract>> {
    const response = await this.metamaskProvider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.snapId,
        request: {
          method: "starkNet_recoverAccounts",
          params: {
            startScanIndex: 0,
            maxScanned: 1,
            maxMissed: 1,
            chainId: chainId,
          },
        },
      },
    })

    return response as unknown as Array<AccContract>
  }
}
