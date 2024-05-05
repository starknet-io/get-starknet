import { getStarknet } from "../main"
import { mockStorageFunction } from "./storage.mock"
import {
  ArgentXMock,
  BraavosMock,
  OKXMock,
  UnknownWalletAMock,
  UnknownWalletBMock,
  makePreAuthorized,
} from "./wallet.mock"
import { describe, expect, it } from "vitest"

function getWallet(
  window: any,
  storageFactoryImplementation = mockStorageFunction(),
) {
  return getStarknet({
    windowObject: window,
    isWalletObject: (wallet: any) => wallet.id !== "unknown",
    storageFactoryImplementation,
  })
}

describe("getAvailableWallets()", () => {
  it("should return all injected wallets", async () => {
    const sn = getWallet({
      bamboozle: {},
      bamboozleWallet: {
        id: "bamboozle",
        name: "Bamboozle",
        icon: "https://bamboozle.com/icon.png",
      },
      starknet: ArgentXMock,
      "starknet-braavos": BraavosMock,
      starknet_okxwallet: OKXMock,
    })
    const availableWallets = await sn.getAvailableWallets()
    expect(availableWallets.length).toBe(3)
    expect(availableWallets).toContainEqual(ArgentXMock)
    expect(availableWallets).toContainEqual(BraavosMock)
    expect(availableWallets).toContainEqual(OKXMock)
  })
  it("should return one injected wallet", async () => {
    const sn = getWallet({
      "starknet-argent": ArgentXMock,
    })
    const availableWallets = await sn.getAvailableWallets()
    expect(availableWallets.length).toBe(1)
    expect(availableWallets).toContainEqual(ArgentXMock)
  })
  it("should return unknown but still injected wallets", async () => {
    const sn = getWallet({
      "starknet-walletA": UnknownWalletAMock,
      "starknet-walletB": UnknownWalletBMock,
    })
    const availableWallets = await sn.getAvailableWallets()
    expect(availableWallets.length).toBe(2)
    expect(availableWallets).toContainEqual(UnknownWalletAMock)
    expect(availableWallets).toContainEqual(UnknownWalletBMock)
  })
  it("should exclude listed wallets", async () => {
    const sn = getWallet({
      "starknet-wallet-a": UnknownWalletAMock,
      "starknet-wallet-b": UnknownWalletBMock,
    })
    const availableWallets = await sn.getAvailableWallets({
      exclude: ["wallet-a"],
    })
    expect(availableWallets.length).toBe(1)
    expect(availableWallets).toContainEqual(UnknownWalletBMock)
  })
  it("should include listed wallets", async () => {
    const sn = getWallet({
      "starknet-wallet-a": UnknownWalletAMock,
      "starknet-wallet-b": UnknownWalletBMock,
    })
    const availableWallets = await sn.getAvailableWallets({
      include: ["wallet-a"],
    })
    expect(availableWallets.length).toBe(1)
    expect(availableWallets).toContainEqual(UnknownWalletAMock)
  })
  // run 10 times to make sure it was sorted and wasnt just luck
  it.each(new Array(10).fill(0))("should sort wallets 1", async () => {
    const sn = getWallet({
      "starknet-wallet-a": UnknownWalletAMock,
      "starknet-wallet-b": UnknownWalletBMock,
    })
    const availableWallets = await sn.getAvailableWallets({
      sort: ["wallet-a"],
    })
    expect(availableWallets.length).toBe(2)
    expect(availableWallets[0]).toEqual(UnknownWalletAMock)
    expect(availableWallets[1]).toEqual(UnknownWalletBMock)
  })
  // run 10 times to make sure it was sorted and wasnt just luck
  it.each(new Array(10).fill(0))("should sort wallets 2", async () => {
    const sn = getWallet({
      "starknet-wallet-a": UnknownWalletAMock,
      "starknet-wallet-b": UnknownWalletBMock,
    })
    const availableWallets = await sn.getAvailableWallets({
      sort: ["wallet-b"],
    })
    expect(availableWallets.length).toBe(2)
    expect(availableWallets[0]).toEqual(UnknownWalletBMock)
    expect(availableWallets[1]).toEqual(UnknownWalletAMock)
  })
})

describe("getPreAuthorizedWallets()", () => {
  it("should return all preauthorized wallets", async () => {
    const sn = getWallet({
      "starknet-argent": makePreAuthorized(true)(ArgentXMock),
      "starknet-braavos": makePreAuthorized(true)(BraavosMock),
      starknet_okxwallet: makePreAuthorized(true)(OKXMock),
    })
    const preauthorizedWallets = await sn.getPreAuthorizedWallets()
    expect(preauthorizedWallets.length).toBe(3)
    expect(preauthorizedWallets.map((w) => w.id)).contains(ArgentXMock.id)
    expect(preauthorizedWallets.map((w) => w.id)).contains(BraavosMock.id)
    expect(preauthorizedWallets.map((w) => w.id)).contains(OKXMock.id)
  })
  it("should return one preauthorized wallet", async () => {
    const sn = getWallet({
      "starknet-argent": makePreAuthorized(true)(ArgentXMock),
      "starknet-braavos": makePreAuthorized(false)(BraavosMock),
      starknet_okxwallet: makePreAuthorized(false)(OKXMock),
    })
    const preauthorizedWallets = await sn.getPreAuthorizedWallets()
    expect(preauthorizedWallets.length).toBe(1)
    expect(preauthorizedWallets.map((w) => w.id)).contains(ArgentXMock.id)
  })
})

describe("getDiscoveryWallets()", () => {
  it("should return all discovery wallets", async () => {
    const sn = getWallet({})
    const discoveryWallets = await sn.getDiscoveryWallets()
    expect(discoveryWallets.length).toBe(4)
    expect(discoveryWallets.map((w) => w.id)).contains(ArgentXMock.id)
    expect(discoveryWallets.map((w) => w.id)).contains(BraavosMock.id)
    expect(discoveryWallets.map((w) => w.id)).contains(OKXMock.id)
  })
})
