import { StarknetWindowObject } from "get-starknet"
import "starknet"

export const sendErc20Transaction = async (wallet: StarknetWindowObject) => {
  let account = wallet.account

  const response = await account?.execute({
    contractAddress:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    calldata: [
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      "10",
      "0",
    ],
    entrypoint: "transfer",
  })

  console.log("response -----> ", response)
}

export const signMessage = async (wallet: StarknetWindowObject) => {
  const typeData = {
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

  const signature = await wallet.account?.signMessage(typeData)
  console.log("signature is ----> ", signature)
}

export const deployContract = async (wallet: StarknetWindowObject) => {
  const response = await wallet.account?.deployContract(
    {
      classHash: BigInt(
        "0x189ce59d98d8d3883a5a9fc7026cc94519ca099147196680734ec46aee5e750",
      ),
      constructorCalldata: [],
    },
    {},
  )

  console.log("respone from deploy is", response)
}
