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

interface Wallet {
  request<T>(request: { method: string; params: any }): Promise<T>
}
//todo(harsh): signer needs to be implemented
export class MetaMaskSigner implements SignerInterface {
  #metamaskProvider: Wallet
  #snapId: string
  #address: string

  constructor(metamaskProvider: Wallet, snapId: string, address: string) {
    this.#metamaskProvider = metamaskProvider
    this.#snapId = snapId
    this.#address = address
  }
  async getPubKey(): Promise<string> {
    return await this.#metamaskProvider.request({
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
    })
  }

  async signMessage(
    typedData: TypedData,
    accountAddress: string,
  ): Promise<Signature> {
    return await this.#metamaskProvider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_extractPublicKey",
          params: {
            typedDataMessag: typedData,
            signerAddress: accountAddress,
          },
        },
      },
    })
  }

  async signTransaction(
    transactions: Call[],
    transactionsDetail: InvocationsSignerDetails,
    abis?: Abi[] | undefined,
  ): Promise<Signature> {
    return await this.#metamaskProvider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.#snapId,
        request: {
          method: "starkNet_extractPublicKey",
          params: {
            userAddress: this.#address,
            transactions: transactions,
            transactionsDetail: transactionsDetail,
            abis: abis,
          },
        },
      },
    })
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
