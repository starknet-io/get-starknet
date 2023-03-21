import { usePenpalParent } from "@weblivion/react-penpal"
import Image from "next/image"
import { useEffect } from "react"
import { Abi, AllowArray, Call, InvocationsDetails, typedData } from "starknet"

export default function AccountModal() {
  const { parentMethods, connection } = usePenpalParent({
    methods: {
      enable() {
        console.log("enable in child")
        return {
          address:
            "0x67b9be2bdf155e96fb195615eb825753b88840bc63bd976436060ebfd8401e0",
          chainid: "0x534e5f474f45524c49",
        }
      },
      async execute(
        calls: AllowArray<Call>,
        abis?: Abi[] | undefined,
        transactionsDetail?: InvocationsDetails,
      ) {
        return {
          transaction_hash:
            "0x06c1470188c8266b0cd2bc4800a30761e25b913a3fe7d9f44276f19b9885b7f9",
        }
      },
      async signMessage(typedData: typedData.TypedData) {
        return [
          "0xceda96c27790f5a5d7d2eb9a9463cfd4843c823603cdfa04e07ef38beef4f6",
          "0x49b5dd5a68c26e03de4c398749efb4d9fa79736492463cffb0a823415716fe4",
        ]
      },
      isPreauthorized(host: string) {
        throw Error("not implemented")
      },
      addNetwork(params: any) {
        throw Error("not implemented")
      },
      switchNetwork(params: any) {
        throw Error("not implemented")
      },
      addToken(params: any) {
        throw Error("not implemented")
      },
    },
  })

  useEffect(() => {
    const notify = async () => {
      if (connection) {
        await parentMethods.notifyAccountChange("new-account-address")
        await parentMethods.notifyNetworkChange("0xdeadbabedeadbabe")
      }
    }
    notify()
  }, [connection])

  return <div>Account Modal</div>
}
