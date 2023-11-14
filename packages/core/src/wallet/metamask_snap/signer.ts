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

  constructor(snap: MetaMaskSnap) {
    this.#snap = snap
  }

  async getPubKey(): Promise<string> {
    return this.#snap.getPubKey()
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
    return this.#snap.signTransaction(transactions, transactionsDetail, abis)
  }

  async signDeployAccountTransaction(
    transaction: DeployAccountSignerDetails,
  ): Promise<Signature> {
    return this.#snap.signDeployAccountTransaction(transaction)
  }

  async signDeclareTransaction(
    transaction: DeclareSignerDetails,
  ): Promise<Signature> {
    return this.#snap.signDeclareTransaction(transaction)
  }
}
