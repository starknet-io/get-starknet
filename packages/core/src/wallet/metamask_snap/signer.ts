import { MetaMaskSnap } from "./snap"
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
  #snap: MetaMaskSnap
  #address: string

  constructor(snap: MetaMaskSnap, address: string) {
    this.#snap = snap
    this.#address = address
  }

  async getPubKey(): Promise<string> {
    return this.#snap.getPubKey(this.#address)
  }

  async signMessage(
    typedData: TypedData,
    accountAddress: string,
  ): Promise<Signature> {
    return this.#snap.signMessage(typedData, false, accountAddress)
  }

  async signTransaction(
    transactions: Call[],
    transactionsDetail: InvocationsSignerDetails,
    abis?: Abi[] | undefined,
  ): Promise<Signature> {
    return this.#snap.signTransaction(
      this.#address,
      transactions,
      transactionsDetail,
      abis,
    )
  }

  async signDeployAccountTransaction(
    transaction: DeployAccountSignerDetails,
  ): Promise<Signature> {
    return this.#snap.signDeployAccountTransaction(this.#address, transaction)
  }

  async signDeclareTransaction(
    transaction: DeclareSignerDetails,
  ): Promise<Signature> {
    return this.#snap.signDeclareTransaction(this.#address, transaction)
  }
}
