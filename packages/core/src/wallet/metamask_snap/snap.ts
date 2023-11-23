import {
  AddStarknetChainParameters,
  SwitchStarknetChainParameter,
  WatchAssetParameters,
} from "../../StarknetWindowObject"
import {
  AccContract,
  MetaMaskProvider,
  Network,
  RequestSnapResponse,
} from "./type"
import {
  Abi,
  AllowArray,
  Call,
  DeclareContractPayload,
  DeclareContractResponse,
  DeclareSignerDetails,
  DeployAccountSignerDetails,
  InvocationsDetails,
  InvocationsSignerDetails,
  InvokeFunctionResponse,
  Signature,
  TypedData,
} from "starknet"

export class MetaMaskSnap {
  #provider: MetaMaskProvider
  #snapId: string
  #version: string

  constructor(snapId: string, version: string, provider: MetaMaskProvider) {
    this.#provider = provider
    this.#snapId = snapId
    this.#version = version
  }

  async getPubKey(userAddress: string): Promise<string> {
    return (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_extractPublicKey",
          params: {
            userAddress,
            ...(await this.#getSnapParams()),
          },
        },
      },
    })) as string
  }

  async signTransaction(
    signerAddress: string,
    transactions: Call[],
    transactionsDetail: InvocationsSignerDetails,
    abis?: Abi[] | undefined,
  ): Promise<Signature> {
    return (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_signTransaction",
          params: {
            signerAddress,
            transactions,
            transactionsDetail,
            abis: abis,
            ...(await this.#getSnapParams()),
          },
        },
      },
    })) as Signature
  }

  async signDeployAccountTransaction(
    signerAddress: string,
    transaction: DeployAccountSignerDetails,
  ): Promise<Signature> {
    return (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_signDeployAccountTransaction",
          params: {
            signerAddress,
            transaction,
            ...(await this.#getSnapParams()),
          },
        },
      },
    })) as Signature
  }

  async signDeclareTransaction(
    signerAddress: string,
    transaction: DeclareSignerDetails,
  ): Promise<Signature> {
    return (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_signDeclareTransaction",
          params: {
            signerAddress,
            transaction,
            ...(await this.#getSnapParams()),
          },
        },
      },
    })) as Signature
  }

  async execute(
    senderAddress: string,
    txnInvocation: AllowArray<Call>,
    abis?: Abi[] | undefined,
    invocationsDetails?: InvocationsDetails,
  ): Promise<InvokeFunctionResponse> {
    return (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_executeTxn",
          params: {
            senderAddress,
            txnInvocation,
            abis,
            invocationsDetails,
            ...(await this.#getSnapParams()),
          },
        },
      },
    })) as InvokeFunctionResponse
  }

  async signMessage(
    typedDataMessage: TypedData,
    enableAutherize: boolean,
    signerAddress: string,
  ): Promise<Signature> {
    return (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_signMessage",
          params: {
            signerAddress,
            typedDataMessage,
            enableAutherize: enableAutherize,
            ...(await this.#getSnapParams()),
          },
        },
      },
    })) as Signature
  }

  async declare(
    senderAddress: string,
    contractPayload: DeclareContractPayload,
    invocationsDetails?: InvocationsDetails,
  ): Promise<DeclareContractResponse> {
    return (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_declareContract",
          params: {
            senderAddress,
            contractPayload,
            invocationsDetails,
            ...(await this.#getSnapParams()),
          },
        },
      },
    })) as DeclareContractResponse
  }

  async getNetwork(chainId: string): Promise<Network | undefined> {
    const response = (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
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

  async recoverDefaultAccount(chainId: string): Promise<AccContract> {
    const result = await this.recoverAccounts(chainId, 0, 1, 1)
    return result[0]
  }

  async recoverAccounts(
    chainId: string,
    startScanIndex: number = 0,
    maxScanned: number = 1,
    maxMissed: number = 1,
  ): Promise<Array<AccContract>> {
    return (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_recoverAccounts",
          params: {
            startScanIndex,
            maxScanned,
            maxMissed,
            chainId,
          },
        },
      },
    })) as Array<AccContract>
  }

  async switchNetwork(
    params: SwitchStarknetChainParameter,
  ): Promise<{ result: boolean }> {
    try {
      // Use the provided chainId to switch the network
      const response = (await this.#provider.request({
        method: "wallet_invokeSnap",
        params: {
          snapId: this.#snapId,
          request: {
            method: "starkNet_switchNetwork",
            params: {
              chainId: params.chainId,
              enableAutherize: true,
            },
          },
        },
      })) as { success: boolean }

      return { result: response.success }
    } catch (error) {
      console.error("Error switching Starknet chain:", error)
      return { result: false }
    }
  }

  async addStarknetChain(
    params: AddStarknetChainParameters,
  ): Promise<{ result: boolean }> {
    try {
      const response = (await this.#provider.request({
        method: "wallet_invokeSnap",
        params: {
          snapId: this.#snapId,
          request: {
            method: "starkNet_addNetwork",
            params: {
              networkName: params.chainName,
              networkChainId: params.chainId,
              networkBaseUrl: params.baseUrl,
              networkNodeUrl: params.rpcUrls,
              networkVoyagerUrl: params.blockExplorerUrls
                ? params.blockExplorerUrls[0]
                : "",
            },
          },
        },
      })) as boolean

      return { result: response }
    } catch (error) {
      console.error("Error adding Starknet chain:", error)
      return { result: false }
    }
  }

  async watchAsset(params: WatchAssetParameters): Promise<{ result: boolean }> {
    try {
      const response = await this.#provider.request({
        method: "wallet_invokeSnap",
        params: {
          snapId: this.#snapId,
          request: {
            method: "starkNet_addErc20Token",
            params: {
              tokenAddress: params.options.address,
              tokenName: params.options.name,
              tokenSymbol: params.options.symbol,
              tokenDecimals: params.options.decimals,
            },
          },
        },
      })
      if (response === false) {
        return { result: false }
      }
      return { result: true }
    } catch (error) {
      console.error("Error watching asset:", error)
      return { result: false }
    }
  }

  //TODO cache it
  async getCurrentNetwork(): Promise<Network> {
    const response = (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_getCurrentNetwork",
          params: {},
        },
      },
    })) as unknown as Network

    return response
  }

  async #getSnapParams() {
    const network = await this.getCurrentNetwork()
    return {
      chainId: network.chainId,
    }
  }

  static async GetProvider(window: any) {
    let { ethereum } = window
    if (!ethereum) {
      return null
    }
    let providers = [ethereum]

    //ethereum.detected or ethereum.providers may exist when more than 1 wallet installed
    if (ethereum.hasOwnProperty("detected")) {
      providers = ethereum["detected"]
    } else if (ethereum.hasOwnProperty("providers")) {
      providers = ethereum["providers"]
    }

    //delect provider by sending request
    for (const provider of providers) {
      if (provider && (await MetaMaskSnap.IsSupportSnap(provider))) {
        return provider
      }
    }
    return null
  }

  static async IsSupportSnap(provider: any) {
    try {
      await provider.request({
        method: "wallet_getSnaps",
      })
      return true
    } catch {
      return false
    }
  }

  async installIfNot() {
    const response = (await this.#provider.request({
      method: "wallet_requestSnaps",
      params: {
        [this.#snapId]: { version: this.#version },
      },
    })) as RequestSnapResponse
    if (!response || !response[this.#snapId]?.enabled) {
      throw new Error(`Snap ${this.#snapId} has not installed`)
    }
  }

  async isInstalled() {
    try {
      await this.#provider.request({
        method: "wallet_invokeSnap",
        params: {
          snapId: this.#snapId,
          request: {
            method: "ping",
          },
        },
      })
      return true
    } catch (err) {
      return false
    }
  }
}
