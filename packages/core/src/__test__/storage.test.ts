import { getStarknet } from "../main"
import { mockStorageFunction } from "./storage.mock"
import {
  ArgentXMock,
  BraavosMock,
  FordefiMock,
  KeplrMock,
  OKXMock,
  UnknownWalletAMock,
  UnknownWalletBMock,
  makeAuthorized,
  makeConnected,
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

describe("getLastConnectedWallet()", () => {
  it("should return null if no last wallet set", async () => {
    const sn = getWallet({
      "starknet-walletA": makeAuthorized(false)(UnknownWalletAMock),
      "starknet-walletB": makeAuthorized(false)(UnknownWalletBMock),
    })
    const lastConnectedWallet = await sn.getLastConnectedWallet()
    expect(lastConnectedWallet).toBe(null)
  })
  it("should return null if the last connected wallet is not available", async () => {
    const sn = getWallet(
      {
        "starknet-walletA": makeAuthorized(false)(UnknownWalletAMock),
        "starknet-walletB": makeAuthorized(false)(UnknownWalletBMock),
      },
      mockStorageFunction({
        "gsw-last": "braavos",
      }),
    )
    const lastConnectedWallet = await sn.getLastConnectedWallet()
    expect(lastConnectedWallet).toBe(null)
  })
  it("should not return the last connected wallet if not preauthorized", async () => {
    const sn = getWallet(
      {
        "starknet-argentX": makeAuthorized(false)(ArgentXMock),
        "starknet-braavos": makeAuthorized(false)(BraavosMock),
        starknet_okxwallet: makeAuthorized(false)(OKXMock),
        starknet_keplr: makeAuthorized(false)(KeplrMock),
        starknet_fordefi: makeAuthorized(false)(FordefiMock),
      },
      mockStorageFunction({
        "gsw-last": "braavos",
      }),
    )
    const lastConnectedWallet = await sn.getLastConnectedWallet()
    expect(lastConnectedWallet).toBe(null)
  })
  it("should return the last connected wallet if still preauthorized", async () => {
    const sn = getWallet(
      {
        "starknet-argentX": makeAuthorized(false)(ArgentXMock),
        "starknet-braavos": makeAuthorized(true)(BraavosMock),
        starknet_okxwallet: makeAuthorized(false)(OKXMock),
        starknet_keplr: makeAuthorized(false)(KeplrMock),
        starknet_fordefi: makeAuthorized(false)(FordefiMock),
      },
      mockStorageFunction({
        "gsw-last": "braavos",
      }),
    )
    const lastConnectedWallet = await sn.getLastConnectedWallet()
    expect(lastConnectedWallet?.id).toBe(BraavosMock.id)
  })
  it("should return the last connected wallet when last is available", async () => {
    const sn = getWallet(
      {
        "starknet-argentX": makeAuthorized(true)(ArgentXMock),
        "starknet-braavos": makeAuthorized(true)(BraavosMock),
        starknet_okxwallet: makeAuthorized(true)(OKXMock),
        starknet_keplr: makeAuthorized(true)(KeplrMock),
        starknet_fordefi: makeAuthorized(true)(FordefiMock),
      },
      mockStorageFunction({ "gsw-last": "braavos" }),
    )
    const lastConnectedWallet = await sn.getLastConnectedWallet()
    expect(lastConnectedWallet?.id).toBe(BraavosMock.id)
  })
  it("should set the last connected wallet when enabled", async () => {
    const sn = getWallet({
      "starknet-argentX": makeConnected(true)(ArgentXMock),
      "starknet-braavos": makeConnected(true)(BraavosMock),
      starknet_okxwallet: makeConnected(true)(OKXMock),
      starknet_keplr: makeAuthorized(true)(KeplrMock),
      starknet_fordefi: makeAuthorized(true)(FordefiMock),
    })
    const lastConnectedWallet = await sn.getLastConnectedWallet()
    expect(lastConnectedWallet).toBe(null)

    const [newLastConnectedWallet] = await sn.getAvailableWallets()
    await sn.enable(newLastConnectedWallet)
    const lastConnectedWalletAfterEnable = await sn.getLastConnectedWallet()
    expect(lastConnectedWalletAfterEnable).toBe(newLastConnectedWallet)
  })
  it("enabling fails", async () => {
    const sn = getWallet({
      "starknet-argentX": makeConnected(false)(ArgentXMock),
    })
    const lastConnectedWallet = await sn.getLastConnectedWallet()
    expect(lastConnectedWallet).toBe(null)

    const [newConnectedWallet] = await sn.getAvailableWallets()
    expect(sn.enable(newConnectedWallet)).rejects.toThrow()
  })
  it("should default disable", async () => {
    const sn = getWallet(
      {
        "starknet-argentX": makeAuthorized(true)(ArgentXMock),
        "starknet-braavos": makeAuthorized(true)(BraavosMock),
        starknet_okxwallet: makeAuthorized(true)(OKXMock),
        starknet_keplr: makeAuthorized(true)(KeplrMock),
        starknet_fordefi: makeAuthorized(true)(FordefiMock),
      },
      mockStorageFunction({
        "gsw-last": "braavos",
      }),
    )
    const lastConnectedWallet = await sn.getLastConnectedWallet()
    expect(lastConnectedWallet?.id).toBe(BraavosMock.id)
    if (lastConnectedWallet?.id) {
      await sn.disconnect()
      expect((await sn.getLastConnectedWallet())?.id).toBe(BraavosMock.id)
    }
  })
  it("should disable with clearLastWallet", async () => {
    const sn = getWallet(
      {
        "starknet-argentX": makeAuthorized(true)(ArgentXMock),
        "starknet-braavos": makeAuthorized(true)(BraavosMock),
        starknet_okxwallet: makeAuthorized(true)(OKXMock),
        starknet_keplr: makeAuthorized(true)(KeplrMock),
        starknet_fordefi: makeAuthorized(true)(FordefiMock),
      },
      mockStorageFunction({
        "gsw-last": "braavos",
      }),
    )
    const lastConnectedWallet = await sn.getLastConnectedWallet()
    expect(lastConnectedWallet?.id).toBe(BraavosMock.id)
    if (lastConnectedWallet?.id) {
      await sn.disconnect({ clearLastWallet: true })
      expect(await sn.getLastConnectedWallet()).toBe(null)
    }
  })
})
