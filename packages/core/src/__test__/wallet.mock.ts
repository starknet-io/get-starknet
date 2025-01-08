import type { StarknetWindowObject } from "../StarknetWindowObject"
import wallets from "../discovery"

type WalletMock = Pick<
  StarknetWindowObject,
  "id" | "name" | "icon" | "isPreauthorized"
>

export const UnknownWalletAMock: WalletMock = {
  id: "wallet-a",
  name: "Wallet A",
  icon: "https://avatars.dicebear.com/api/initials/Wallet%20A.svg",
  isPreauthorized: async () => false,
}
export const UnknownWalletBMock: WalletMock = {
  id: "wallet-b",
  name: "Wallet B",
  icon: "https://avatars.dicebear.com/api/initials/Wallet%20B.svg",
  isPreauthorized: async () => false,
}

export const ArgentXMock: WalletMock = {
  ...wallets.find((w) => w.id === "argentX")!,
  isPreauthorized: async () => false,
}

export const BraavosMock: WalletMock = {
  ...wallets.find((w) => w.id === "braavos")!,
  isPreauthorized: async () => false,
}

export const OKXMock: WalletMock = {
  ...wallets.find((w) => w.id === "okxwallet")!,
  isPreauthorized: async () => false,
}

export const KeplrMock: WalletMock = {
  ...wallets.find((w) => w.id === "keplr")!,
  isPreauthorized: async () => false,
}

export const FordefiMock: WalletMock = {
  ...wallets.find((w) => w.id === "fordefi")!,
  isPreauthorized: async () => false,
}

export function makePreAuthorized(isPreauthorized: boolean) {
  return (wallet: WalletMock) => ({
    ...wallet,
    isPreauthorized: async () => isPreauthorized,
  })
}

export function makeConnected(isConnected: boolean) {
  return (wallet: WalletMock) => ({
    ...makePreAuthorized(true)(wallet),
    enable: async () => [],
    isConnected,
  })
}
