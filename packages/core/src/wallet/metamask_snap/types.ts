export type ChainId = string

export type RequestSnapRequest = {
  method: string
  params: {
    [key in string]: {
      version?: string
    }
  }
}

export type SnapRequest<Params> = RequestSnapRequest | InvokeSnapRequest<Params>

export type InvokeSnapRequest<Params> = {
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

export type RequestSnapResponse = {
  [key in string]: {
    version: string
    id: string
    enabled: boolean
    blocked: boolean
  }
}
