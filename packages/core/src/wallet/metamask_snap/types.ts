export type ChainId = `0x${string}`

export type SnapRequest<Params> = {
  method: string
  params: {
    snapId: string
    request: {
      method: string
      params: Params
    }
  }
}

export type SendTransactionParam = {
  contractAddress: string
  contractFuncName: string
  contractCallData: string
  senderAddress: string
  maxFee?: string | null
  chainId: string
}
