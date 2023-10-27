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

//todo(harsh): signer needs to be implemented
export class MetaMaskSigner extends SignerInterface {
  getPubKey(): Promise<string> {
    throw new Error("Method not implemented.")
  }
  signMessage(
    typedData: TypedData,
    accountAddress: string,
  ): Promise<Signature> {
    throw new Error("Method not implemented.")
  }
  signTransaction(
    transactions: Call[],
    transactionsDetail: InvocationsSignerDetails,
    abis?: Abi[] | undefined,
  ): Promise<Signature> {
    throw new Error("Method not implemented.")
  }
  signDeployAccountTransaction(
    transaction: DeployAccountSignerDetails,
  ): Promise<Signature> {
    throw new Error("Method not implemented.")
  }
  signDeclareTransaction(
    transaction: DeclareSignerDetails,
  ): Promise<Signature> {
    throw new Error("Method not implemented.")
  }
}
