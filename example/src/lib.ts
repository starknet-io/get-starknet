import { StarknetWindowObject } from "get-starknet"
import { constants } from "starknet"

const signMessagePayload = {
  types: {
    StarkNetDomain: [
      { name: "name", type: "felt" },
      { name: "version", type: "felt" },
      { name: "chainId", type: "felt" },
    ],
    Person: [
      { name: "name", type: "felt" },
      { name: "wallet", type: "felt" },
    ],
    Mail: [
      { name: "from", type: "Person" },
      { name: "to", type: "Person" },
      { name: "contents", type: "felt" },
    ],
  },
  primaryType: "Mail",
  domain: {
    name: "StarkNet Mail",
    version: "1",
    chainId: 1,
  },
  message: {
    from: {
      name: "Cow",
      wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
    },
    to: {
      name: "Bob",
      wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
    },
    contents: "Hello, Bob!",
  },
}

const transactionPayload = {
  contractAddress:
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  calldata: [
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    "10",
    "0",
  ],
  entrypoint: "transfer",
}

const signTransactionsDetail = {
  walletAddress:
    "0x00b28a089e7fb83debee4607b6334d687918644796b47d9e9e38ea8213833137",
  chainId: "0x534e5f474f45524c49",
  cairoVersion: "0",
  nonce: "0x1",
  version: "0x0",
  maxFee: 100,
}

const signDeployAccountTransactionPayload = {
  classHash:
    "0x025ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918",
  contractAddress:
    "0x00b28a089e7fb83debee4607b6334d687918644796b47d9e9e38ea8213833137",
  constructorCalldata: [],
  addressSalt:
    "0x025ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918",
  chainId: "0x534e5f474f45524c49",
  nonce: "0x1",
  version: "0x0",
  maxFee: 100,
}

const deployContractPayload = {
  classHash: BigInt(
    "0x189ce59d98d8d3883a5a9fc7026cc94519ca099147196680734ec46aee5e750",
  ),
  constructorCalldata: [],
}

const delcareContractPayload = {
  classHash:
    "0x025ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918",
  senderAddress:
    "0x00b28a089e7fb83debee4607b6334d687918644796b47d9e9e38ea8213833137",
  chainId: constants.StarknetChainId.SN_GOERLI,
  nonce: "0x1",
  version: "0x0",
  maxFee: 100,
}

export const sendErc20Transaction = async (wallet: StarknetWindowObject) => {
  try {
    const response = await wallet.account?.execute(transactionPayload)
    console.log("response is ----> ", response)
  } catch (err) {
    console.log("error", err)
  }
}

export const deployContract = async (wallet: StarknetWindowObject) => {
  try {
    const response = await wallet.account?.deployContract(
      deployContractPayload,
      {},
    )
    console.log("response is ----> ", response)
  } catch (err) {
    console.log("error", err)
  }
}

export const getPubKey = async (wallet: StarknetWindowObject) => {
  try {
    const response = await wallet.account?.signer.getPubKey()
    console.log("response is ----> ", response)
  } catch (err) {
    console.log("error", err)
  }
}

export const signMessage = async (wallet: StarknetWindowObject) => {
  try {
    const response = await wallet.account?.signMessage(signMessagePayload)
    console.log("response is ----> ", response)
  } catch (err) {
    console.log("error", err)
  }
}

export const signMessageSlient = async (wallet: StarknetWindowObject) => {
  try {
    const response = await wallet.account?.signer.signMessage(
      signMessagePayload,
      wallet.account?.address,
    )
    console.log("sign is ----> ", response)

    if (response) {
      const verify = await wallet.account?.verifyMessage(
        signMessagePayload,
        response,
      )

      console.log("verify result is ----> ", verify)
    }
  } catch (err) {
    console.log("error", err)
  }
}

export const signTransaction = async (wallet: StarknetWindowObject) => {
  const response = await wallet.account?.signer.signTransaction(
    [transactionPayload],
    signTransactionsDetail,
  )
  console.log("sign is ----> ", response)
}

export const signDeployAccountTransaction = async (
  wallet: StarknetWindowObject,
) => {
  const response = await wallet.account?.signer.signDeployAccountTransaction(
    signDeployAccountTransactionPayload,
  )
  console.log("sign is ----> ", response)
}

export const signDeclareTransaction = async (wallet: StarknetWindowObject) => {
  const response = await wallet.account?.signer.signDeclareTransaction(
    delcareContractPayload,
  )

  console.log("sign is ----> ", response)
}

export const getNonce = async (wallet: StarknetWindowObject) => {
  const response = await wallet.account?.getNonce()
  console.log("response is ----> ", response)
}
