import { MetaMaskInpageProvider } from "@metamask/providers"
import {
  Abi,
  Call,
  DeclareSignerDetails,
  DeployAccountSignerDetails,
  InvocationsSignerDetails,
  Signature,
  SignerInterface,
  TypedData,
} from "starknet"

export class MetaMaskSigner implements SignerInterface {
  #metamaskProvider: MetaMaskInpageProvider
  #snapId: string
  #address: string

  constructor(
    metamaskProvider: MetaMaskInpageProvider,
    snapId: string,
    address: string,
  ) {
    this.#metamaskProvider = metamaskProvider
    this.#snapId = snapId
    this.#address = address
  }

  async getPubKey(): Promise<string> {
    return (await this.#metamaskProvider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_extractPublicKey",
          params: {
            userAddress: this.#address,
          },
        },
      },
    })) as string
  }

  async signMessage(
    typedData: TypedData,
    accountAddress: string,
  ): Promise<Signature> {
    return (await this.#metamaskProvider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_signMessage",
          params: {
            typedDataMessage: typedData,
            signerAddress: accountAddress,
          },
        },
      },
    })) as Signature
  }

  async signTransaction(
    transactions: Call[],
    transactionsDetail: InvocationsSignerDetails,
    abis?: Abi[] | undefined,
  ): Promise<Signature> {
    return (await this.#metamaskProvider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_signTransaction",
          params: {
            userAddress: this.#address,
            transactions: transactions,
            transactionsDetail: transactionsDetail,
            abis: abis,
          },
        },
      },
    })) as Signature
  }

  async signDeployAccountTransaction(
    transaction: DeployAccountSignerDetails,
  ): Promise<Signature> {
    throw new Error("Method not implemented.")
  }

  async signDeclareTransaction(
    transaction: DeclareSignerDetails,
  ): Promise<Signature> {
    throw new Error("Method not implemented.")
  }
}
