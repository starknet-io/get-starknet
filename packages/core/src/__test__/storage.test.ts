import { getSnWallet } from "../main"
import { mockStorageFunction } from "./storage.mock"
import {
  ArgentXMock,
  BraavosMock,
  UnknownWalletAMock,
  UnknownWalletBMock,
  makeConnected,
  makePreAuthorized,
} from "./wallet.mock"
import { describe, expect, it } from "vitest"

function getWallet(
  window: any,
  storageFactoryImplementation = mockStorageFunction(),
) {
  return getSnWallet({
    windowObject: window,
    isWalletObject: (wallet: any) => wallet.id !== "unknown",
    storageFactoryImplementation,
  })
}

describe("getLastConnectedWallet()", () => {
  it("should return null if no last or default wallet set", async () => {
    const sn = getWallet({
      "starknet-walletA": makePreAuthorized(false)(UnknownWalletAMock),
      "starknet-walletB": makePreAuthorized(false)(UnknownWalletBMock),
    })
    const defaultWallet = await sn.getLastConnectedWallet()
    expect(defaultWallet).toBe(null)
  })
  it("should return null if the last connected wallet is not available", async () => {
    const sn = getWallet(
      {
        "starknet-walletA": makePreAuthorized(false)(UnknownWalletAMock),
        "starknet-walletB": makePreAuthorized(false)(UnknownWalletBMock),
      },
      mockStorageFunction({
        "gsw-last": "braavos",
      }),
    )
    const defaultWallet = await sn.getLastConnectedWallet()
    expect(defaultWallet).toBe(null)
  })
  it("should not return the last connected wallet if not preauthorized", async () => {
    const sn = getWallet(
      {
        "starknet-argentX": makePreAuthorized(false)(ArgentXMock),
        "starknet-braavos": makePreAuthorized(false)(BraavosMock),
      },
      mockStorageFunction({
        "gsw-last": "braavos",
      }),
    )
    const defaultWallet = await sn.getLastConnectedWallet()
    expect(defaultWallet).toBe(null)
  })
  it("should return the last connected wallet if still preauthorized", async () => {
    const sn = getWallet(
      {
        "starknet-argentX": makePreAuthorized(false)(ArgentXMock),
        "starknet-braavos": makePreAuthorized(true)(BraavosMock),
      },
      mockStorageFunction({
        "gsw-last": "braavos",
      }),
    )
    const defaultWallet = await sn.getLastConnectedWallet()
    expect(defaultWallet?.id).toBe(BraavosMock.id)
  })
  it("should return the last connected wallet when last and default are available", async () => {
    const sn = getWallet(
      {
        "starknet-argentX": makePreAuthorized(true)(ArgentXMock),
        "starknet-braavos": makePreAuthorized(true)(BraavosMock),
      },
      mockStorageFunction({
        "gsw-last": "braavos",
        "gsw-default": "argentX",
      }),
    )
    const defaultWallet = await sn.getLastConnectedWallet()
    expect(defaultWallet?.id).toBe(BraavosMock.id)
  })
  it("should not return the default wallet if last is not available", async () => {
    const sn = getWallet(
      {
        "starknet-argentX": makePreAuthorized(true)(ArgentXMock),
        "starknet-braavos": makePreAuthorized(true)(BraavosMock),
      },
      mockStorageFunction({
        "gsw-default": "argentX",
      }),
    )
    const defaultWallet = await sn.getLastConnectedWallet()
    expect(defaultWallet).toBe(null)
  })
  it("should return the default wallet", async () => {
    const sn = getWallet(
      {
        "starknet-argentX": makePreAuthorized(true)(ArgentXMock),
        "starknet-braavos": makePreAuthorized(true)(BraavosMock),
      },
      mockStorageFunction({
        "gsw-default": "argentX",
      }),
    )
    const defaultWallet = await sn.getDefaultWallet()
    expect(defaultWallet?.id).toBe(ArgentXMock.id)
  })
  it("should set the default wallet when enabled", async () => {
    const sn = getWallet({
      "starknet-argentX": makeConnected(true)(ArgentXMock),
      "starknet-braavos": makeConnected(true)(BraavosMock),
    })
    const defaultWallet = await sn.getLastConnectedWallet()
    expect(defaultWallet).toBe(null)

    const [newDefaultWallet] = await sn.getAvailableWallets()
    await sn.enable(newDefaultWallet)
    const defaultWalletAfterEnable = await sn.getLastConnectedWallet()
    expect(defaultWalletAfterEnable).toBe(newDefaultWallet)
  })
  it("enabling fails", async () => {
    const sn = getWallet({
      "starknet-argentX": makeConnected(false)(ArgentXMock),
    })
    const defaultWallet = await sn.getLastConnectedWallet()
    expect(defaultWallet).toBe(null)

    const [newDefaultWallet] = await sn.getAvailableWallets()
    expect(sn.enable(newDefaultWallet)).rejects.toThrow()
  })
  it("should default disable", async () => {
    const sn = getWallet(
      {
        "starknet-argentX": makePreAuthorized(true)(ArgentXMock),
        "starknet-braavos": makePreAuthorized(true)(BraavosMock),
      },
      mockStorageFunction({
        "gsw-last": "braavos",
      }),
    )
    const defaultWallet = await sn.getLastConnectedWallet()
    expect(defaultWallet?.id).toBe(BraavosMock.id)
    if (defaultWallet?.id) {
      await sn.disconnect()
      expect(await sn.getLastConnectedWallet()).toBe(null)
    }
  })
})
