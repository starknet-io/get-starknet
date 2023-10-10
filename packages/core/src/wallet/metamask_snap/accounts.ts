import { IMetaMaskInjectedProvider } from "."
import { UDC_ADDRESS } from "./constants"
import { SendTransactionParam } from "./types"
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
  EstimateFeeAction,
  EstimateFeeDetails,
  EstimateFeeResponse,
  EstimateFeeResponseBulk,
  Invocation,
  Invocations,
  InvocationsDetails,
  InvocationsDetailsWithNonce,
  InvokeFunctionResponse,
  Nonce,
  Provider,
  ProviderInterface,
  Signature,
  SimulateTransactionDetails,
  SimulateTransactionResponse,
  TypedData,
  UniversalDeployerContractPayload,
  num,
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
  provider: ProviderInterface
  cairoVersion: CairoVersion
  metaMaskInjectedProvider: IMetaMaskInjectedProvider
  snapId: string

  constructor(
    address: string,
    provider: ProviderInterface,
    cairoVersion: CairoVersion = "0",
    metamMaskInjectedProvider: IMetaMaskInjectedProvider,
    snapId: string,
  ) {
    super(provider)

    this.address = address
    this.provider = provider
    this.cairoVersion = cairoVersion
    this.metaMaskInjectedProvider = metamMaskInjectedProvider
    this.snapId = snapId
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

    return await this.invokeFunction(
      {
        contractAddress,
        entrypoint,
        calldata,
      },
      {},
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

    const contractCallData = calldata ? calldata.join(",") : ""

    const senderAddress = this.address
    const chainId = toHex(await this.provider.getChainId())

    const response = await this.metaMaskInjectedProvider.request<
      SendTransactionParam,
      string
    >({
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

    return response
  }

  async getNonce(blockIdentifier?: BlockIdentifier): Promise<Nonce> {
    return this.provider.getNonceForAddress(this.address, blockIdentifier)
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

  // todo: the return type has to be fixed, i.e to be of type Signature and not
  // of type string
  public async signMessage(typedData: TypedData): Promise<Signature> {
    const signature = await this.metaMaskInjectedProvider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.snapId,
        request: {
          method: "starkNet_signMessage",
          params: {
            typedDataMessage: JSON.stringify(typedData),
            signerAddress: this.address,
            chainId: await this.provider.getChainId(),
          },
        },
      },
    })

    return signature
  }

  async deployAccount(
    _contractPayload: DeployAccountContractPayload,
    _transactionsDetail?: InvocationsDetails | undefined,
  ): Promise<DeployContractResponse> {
    const response = await this.metaMaskInjectedProvider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.snapId,
        request: {
          method: "starkNet_createAccount",
          params: {
            deploy: true,
            chainId: await this.provider.getChainId(),
          },
        },
      },
    })

    return response
  }

  public async declareAndDeploy(
    _payload: DeclareAndDeployContractPayload,
    _details?: InvocationsDetails | undefined,
  ): Promise<DeclareDeployUDCResponse> {
    // todo!()
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

    const compiledConstructorCallData = CallData.compile(constructorCalldata)
    const deploySalt = salt ? salt : stark.randomAddress()

    const response = await this.metaMaskInjectedProvider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.snapId,
        request: {
          method: "starkNet_sendTransaction",
          params: {
            contractAddress: UDC_ADDRESS,
            contractFuncName: "deployContract",
            contractCallData: [
              "0x" + classHash.toString(16),
              deploySalt,
              toCairoBool(unique),
              "0x" + compiledConstructorCallData.length.toString(16),
              ...compiledConstructorCallData,
            ].join(","),
            senderAddress: this.address,
            chainId: await this.provider.getChainId(),
          },
        },
      },
    })

    return response
  }

  // declare isn't allowed via the exposed RPC as of now
  public async declare(
    _contractPayload: DeclareContractPayload,
    _transactionsDetail?: InvocationsDetails | undefined,
  ): Promise<DeclareContractResponse> {
    // todo!()
    throw new Error("declare isn't implemented as of now")
  }
}
