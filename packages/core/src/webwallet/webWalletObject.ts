import type { StarknetWindowObject } from "../StarknetWindowObject"
import { WebWalletProvider } from "../discovery"
import { createModal, getConnection } from "./connection"
import { getStarknetConnectedObject } from "./starknetObject"

export async function getWebWalletStarknetObject(
  wp: WebWalletProvider,
): Promise<StarknetWindowObject | null> {
  const globalWindow = typeof window !== "undefined" ? window : undefined
  if (!globalWindow) {
    throw new Error("window is not defined")
  }

  console.log("in getWebWalletStarknetObject")

  console.log(wp)

  if (wp.url_account === undefined) return null

  const { iframe, modal } = await createModal(wp.url_account, false)

  const connection = await getConnection({ iframe, modal })

  const starknetConnectedObject = getStarknetConnectedObject(
    {
      id: wp.id,
      icon: wp.icon,
      name: wp.name,
      version: "online",
    },
    connection,
  )

  return starknetConnectedObject
}
