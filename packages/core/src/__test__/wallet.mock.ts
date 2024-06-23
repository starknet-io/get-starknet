import wallets from "../discovery"
import { Permission, type StarknetWindowObject } from "@starknet-io/types-js"

type WalletMock = Pick<StarknetWindowObject, "id" | "name" | "icon" | "request">

export const UnknownWalletAMock: WalletMock = {
  id: "wallet-a",
  name: "Wallet A",
  icon: "https://avatars.dicebear.com/api/initials/Wallet%20A.svg",
  request: async () => false,
}
export const UnknownWalletBMock: WalletMock = {
  id: "wallet-b",
  name: "Wallet B",
  icon: "https://avatars.dicebear.com/api/initials/Wallet%20B.svg",
  request: async () => false,
}

export const ArgentXMock: WalletMock = {
  ...wallets.find((w) => w.id === "argentX")!,
  request: async (request) => {
    switch (request.type) {
      case "wallet_getPermissions":
        return []
      default:
        return undefined as any
    }
  },
}

export const BraavosMock: WalletMock = {
  ...wallets.find((w) => w.id === "braavos")!,
  request: async (request) => {
    switch (request.type) {
      case "wallet_getPermissions":
        return []
      default:
        return undefined as any
    }
  },
}

export function makeAuthorized(authorized: boolean) {
  return (wallet: WalletMock) =>
    ({
      ...wallet,
      request: async (request) => {
        switch (request.type) {
          case "wallet_getPermissions":
            return authorized ? [Permission.ACCOUNTS] : []
          default:
            return wallet.request(request)
        }
      },
    } as WalletMock)
}

export function makeConnected(isConnected: boolean) {
  return (wallet: WalletMock) => {
    return {
      ...makeAuthorized(true)(wallet),
      request: async ({ type }) => {
        switch (type) {
          case "wallet_getPermissions":
            return isConnected ? [Permission.ACCOUNTS] : []
          default:
            return []
        }
      },
    } as WalletMock
  }
}
