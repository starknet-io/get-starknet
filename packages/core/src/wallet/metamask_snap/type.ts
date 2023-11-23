export interface MetaMaskProvider {
  request(args: {
    method: string
    params?: unknown[] | Record<string, unknown>
  }): Promise<unknown>
}

export type AccContract = {
  addressSalt: string
  publicKey: string // in hex
  address: string // in hex
  addressIndex: number
  derivationPath: string
  deployTxnHash: string // in hex
  chainId: string // in hex
}

export type Network = {
  name: string
  chainId: string // in hex
  baseUrl: string
  nodeUrl: string
  voyagerUrl: string
  accountClassHash: string // in hex
  useOldAccounts?: boolean
}

export type RequestSnapResponse = {
  [key in string]: {
    enabled: boolean
    version: string
    id: string
    blocked: boolean
  }
}
