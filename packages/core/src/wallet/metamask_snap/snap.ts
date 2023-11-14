import { ChainId } from "./types"
import {
  AccContract,
  Network,
} from "@consensys/starknet-snap/src/types/snapState"
import { MetaMaskInpageProvider } from "@metamask/providers"
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
  #provider: MetaMaskInpageProvider
  #snapId: string
  #address: string | undefined
  #chainId: string

  constructor(
    snapId: string,
    chainId: string,
    provider: MetaMaskInpageProvider,
    address?: string,
  ) {
    this.#provider = provider
    this.#address = address
    this.#chainId = chainId
    this.#snapId = snapId
  }

  async getPubKey(): Promise<string> {
    return (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_extractPublicKey",
          params: {
            userAddress: this.#address,
            ...this.#getSnapParams(),
          },
        },
      },
    })) as string
  }

  async signTransaction(
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
            signerAddress: this.#address,
            transactions: transactions,
            transactionsDetail: transactionsDetail,
            abis: abis,
            ...this.#getSnapParams(),
          },
        },
      },
    })) as Signature
  }

  async signDeployAccountTransaction(
    transaction: DeployAccountSignerDetails,
  ): Promise<Signature> {
    return (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_signDeployAccountTransaction",
          params: {
            signerAddress: this.#address,
            transactions: transaction,
            ...this.#getSnapParams(),
          },
        },
      },
    })) as Signature
  }

  async signDeclareTransaction(
    transaction: DeclareSignerDetails,
  ): Promise<Signature> {
    return (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_signDeclareTransaction",
          params: {
            signerAddress: this.#address,
            transactions: transaction,
            ...this.#getSnapParams(),
          },
        },
      },
    })) as Signature
  }

  async execute(
    calls: AllowArray<Call>,
    abis?: Abi[] | undefined,
    transactionsDetail?: InvocationsDetails,
  ): Promise<InvokeFunctionResponse> {
    return (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_executeTxn",
          params: {
            senderAddress: this.#address,
            calls,
            abis,
            transactionsDetail,
            ...this.#getSnapParams(),
          },
        },
      },
    })) as InvokeFunctionResponse
  }

  async signMessage(
    typedData: TypedData,
    enableAutherize: boolean,
    address?: string,
  ): Promise<Signature> {
    return (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_signMessage",
          params: {
            signerAddress: address || this.#address,
            typedData,
            enableAutherize: enableAutherize,
            ...this.#getSnapParams(),
          },
        },
      },
    })) as Signature
  }

  async declare(
    contractPayload: DeclareContractPayload,
    transactionsDetails?: InvocationsDetails,
  ): Promise<DeclareContractResponse> {
    return (await this.#provider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_declareContract",
          params: {
            senderAddress: this.#address,
            contractPayload,
            invocationsDetails: transactionsDetails,
            ...this.#getSnapParams(),
          },
        },
      },
    })) as DeclareContractResponse
  }

  async getNetwork(chainId: ChainId): Promise<Network | undefined> {
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

  async recoverDefaultAccount(chainId: ChainId): Promise<AccContract> {
    const result = await this.recoverAccounts(chainId, 0, 1, 1)
    return result[0]
  }

  async recoverAccounts(
    chainId: ChainId,
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

  #getSnapParams() {
    return {
      chainId: this.#chainId,
    }
  }
}
