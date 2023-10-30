import { UDC_ADDRESS } from "./constants"
import { MetaMaskSigner } from "./signer"
import { MetaMaskInpageProvider } from "@metamask/providers"
import {
  Abi,
  AccountInterface,
  AllowArray,
  BigNumberish,
  BlockIdentifier,
  CairoVersion,
  Call,
  CallData,
  DeclareAndDeployContractPayload,
  DeclareContractPayload,
  DeclareContractResponse,
  DeclareDeployUDCResponse,
  DeployAccountContractPayload,
  DeployContractResponse,
  DeployContractUDCResponse,
  DeployTransactionReceiptResponse,
  EstimateFeeAction,
  EstimateFeeDetails,
  EstimateFeeResponse,
  EstimateFeeResponseBulk,
  Invocation,
  Invocations,
  InvocationsDetails,
  InvocationsDetailsWithNonce,
  InvokeFunctionResponse,
  MultiDeployContractResponse,
  Nonce,
  Provider,
  ProviderInterface,
  Signature,
  SignerInterface,
  SimulateTransactionDetails,
  SimulateTransactionResponse,
  TypedData,
  UniversalDeployerContractPayload,
  ec,
  num,
  parseUDCEvent,
  stark,
  typedData,
} from "starknet"

const { toBigInt, toHex, toCairoBool } = num
const { getMessageHash } = typedData

export class MetaMaskAccountWrapper
  extends Provider
  implements AccountInterface
{
  address: string
  cairoVersion: CairoVersion
  metaMaskInjectedProvider: MetaMaskInpageProvider
  snapId: string
  signer: SignerInterface

  constructor(
    address: string,
    provider: ProviderInterface,
    cairoVersion: CairoVersion = "0",
    metaMaskInjectedProvider: MetaMaskInpageProvider,
    snapId: string,
  ) {
    super(provider)

    this.address = address
    this.cairoVersion = cairoVersion
    this.metaMaskInjectedProvider = metaMaskInjectedProvider
    this.snapId = snapId
    this.signer = new MetaMaskSigner()
  }

  deploy(
    payload:
      | UniversalDeployerContractPayload
      | UniversalDeployerContractPayload[],
    details?: InvocationsDetails | undefined,
  ): Promise<MultiDeployContractResponse> {
    throw new Error("Method not implemented.")
  }

  async execute(
    calls: AllowArray<Call>,
    _abis: Abi[] | undefined = undefined,
    _transactionsDetail: InvocationsDetails = {},
  ): Promise<InvokeFunctionResponse> {
    const transactions = Array.isArray(calls) ? calls : [calls]
    if (transactions.length > 1) {
      throw new Error("currently multi call is not supported by teh snap")
    }

    let { contractAddress, entrypoint, calldata } = transactions[0]
    let nonce = await this.getNonce()

    return await this.invokeFunction(
      {
        contractAddress,
        entrypoint,
        calldata,
      },
      {
        nonce,
      },
    )
  }

  public async invokeFunction(
    invocation: Invocation,
    details: InvocationsDetailsWithNonce,
  ): Promise<InvokeFunctionResponse> {
    let { contractAddress, calldata, entrypoint } = invocation

    if (!entrypoint) {
      throw new Error("entrypoint is not defined")
    }

    const maxFee = details.maxFee ? toHex(details.maxFee) : null

    const contractCallData = CallData.toHex(calldata).join(",")

    const senderAddress = this.address
    const chainId = toHex(await this.getChainId())

    const response =
      await this.metaMaskInjectedProvider.request<InvokeFunctionResponse>({
        method: "wallet_invokeSnap",
        params: {
          snapId: this.snapId,
          request: {
            method: "starkNet_sendTransaction",
            params: {
              contractAddress,
              contractFuncName: entrypoint,
              contractCallData,
              senderAddress,
              maxFee,
              chainId,
            },
          },
        },
      })

    if (!response) {
      throw new Error("invalid response for starkNet_sendTransaction")
    }
    if (!response.transaction_hash) {
      throw new Error(
        "invalid response for starkNet_sendTransaction, transaction hash not found",
      )
    }

    return { transaction_hash: response.transaction_hash }
  }

  async getNonce(blockIdentifier?: BlockIdentifier): Promise<Nonce> {
    return this.getNonceForAddress(this.address, blockIdentifier)
  }

  public async getSuggestedMaxFee(
    _estimateFeeAction: EstimateFeeAction,
    _details: EstimateFeeDetails,
  ): Promise<bigint> {
    // todo()!
    throw new Error("getSuggestedMaxFee is not implemented")
  }

  public async estimateFeeBulk(
    _invocations: Invocations,
    _details?: EstimateFeeDetails | undefined,
  ): Promise<EstimateFeeResponseBulk> {
    // todo()!
    throw new Error("estimateFeeBulk is not implemented")
  }

  public async estimateInvokeFee(
    _calls: AllowArray<Call>,
    _estimateFeeDetails?: EstimateFeeDetails | undefined,
  ): Promise<EstimateFeeResponse> {
    // todo()!
    throw new Error("estimateInvokeFee is not implemented")
  }

  public async estimateDeclareFee(
    _contractPayload: DeclareContractPayload,
    _estimateFeeDetails?: EstimateFeeDetails | undefined,
  ): Promise<EstimateFeeResponse> {
    // todo()!
    throw new Error("estimateDeclareFee is not implemented")
  }

  public async estimateAccountDeployFee(
    _contractPayload: DeployAccountContractPayload,
    _estimateFeeDetails?: EstimateFeeDetails | undefined,
  ): Promise<EstimateFeeResponse> {
    // todo()!
    throw new Error("estimateAccountDeployFee is not implemented")
  }

  public async estimateDeployFee(
    _deployContractPayload:
      | UniversalDeployerContractPayload
      | UniversalDeployerContractPayload[],
    _transactionsDetail?: InvocationsDetails | undefined,
  ): Promise<EstimateFeeResponse> {
    // todo()!
    throw new Error("estimateDeployFee is not implemented")
  }

  public async simulateTransaction(
    _invocations: Invocations,
    _details?: SimulateTransactionDetails | undefined,
  ): Promise<SimulateTransactionResponse> {
    // todo!()
    throw new Error("simulateTransaction is not implemented")
  }

  // verification

  async verifyMessage(
    typedData: TypedData,
    signature: Signature,
  ): Promise<boolean> {
    const hash = await this.hashMessage(typedData)
    return this.verifyMessageHash(hash, signature)
  }

  async verifyMessageHash(
    hash: BigNumberish,
    signature: Signature,
  ): Promise<boolean> {
    try {
      await this.callContract({
        contractAddress: this.address,
        entrypoint: "isValidSignature",
        calldata: CallData.compile({
          hash: toBigInt(hash).toString(),
          signature: stark.formatSignature(signature),
        }),
      })
      return true
    } catch {
      return false
    }
  }

  // hashing

  public async hashMessage(typedData: TypedData): Promise<string> {
    return getMessageHash(typedData, this.address)
  }

  // todo(harsh): the return type has to be fixed, i.e to be of type Signature and not
  // of type string
  public async signMessage(typedData: TypedData): Promise<Signature> {
    const signature = (await this.metaMaskInjectedProvider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.snapId,
        request: {
          method: "starkNet_signMessage",
          params: {
            typedDataMessage: JSON.stringify(typedData),
            signerAddress: this.address,
            chainId: await this.getChainId(),
          },
        },
      },
    })) as unknown as string

    return ec.starkCurve.Signature.fromDER(signature)
  }

  //todo(harsh): the below method should just use the UDC to deploy the account
  async deployAccount(
    _contractPayload: DeployAccountContractPayload,
    _transactionsDetail?: InvocationsDetails | undefined,
  ): Promise<DeployContractResponse> {
    throw new Error("deploy account is not implemented yet")
  }

  // todo!()
  public async declareAndDeploy(
    _payload: DeclareAndDeployContractPayload,
    _details?: InvocationsDetails | undefined,
  ): Promise<DeclareDeployUDCResponse> {
    throw new Error("declare and deploy is not supported")
  }

  public async deployContract(
    payload:
      | UniversalDeployerContractPayload
      | UniversalDeployerContractPayload[],
    _details?: InvocationsDetails | undefined,
  ): Promise<DeployContractUDCResponse> {
    const udcPayload = Array.isArray(payload) ? payload : [payload]

    if (udcPayload.length > 1) {
      throw new Error("deployment of multiple contracts isn't supported")
    }

    const {
      classHash,
      salt,
      unique = true,
      constructorCalldata,
    } = udcPayload[0]

    const classHashHex = "0x" + classHash.toString(16)

    const compiledConstructorCallData = CallData.toHex(
      constructorCalldata ? constructorCalldata : [],
    )
    const deploySalt = salt ? salt : stark.randomAddress()

    const response = (await this.metaMaskInjectedProvider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.snapId,
        request: {
          method: "starkNet_sendTransaction",
          params: {
            contractAddress: UDC_ADDRESS,
            contractFuncName: "deployContract",
            contractCallData: [
              classHashHex,
              deploySalt,
              toCairoBool(unique),
              "0x" + compiledConstructorCallData.length.toString(16),
              ...compiledConstructorCallData,
            ].join(","),
            senderAddress: this.address,
            chainId: await this.getChainId(),
          },
        },
      },
    })) as unknown as InvokeFunctionResponse

    const txReceipt = await this.waitForTransaction(response.transaction_hash)
    return parseUDCEvent(txReceipt as DeployTransactionReceiptResponse)
  }

  // declare isn't allowed via the exposed RPC as of now
  // todo!()
  public async declare(
    _contractPayload: DeclareContractPayload,
    _transactionsDetail?: InvocationsDetails | undefined,
  ): Promise<DeclareContractResponse> {
    throw new Error("declare isn't implemented as of now")
  }
}
