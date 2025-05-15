// @vitest-environment happy-dom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createStore } from "../src";
import { UnknownWalletAMock, UnknownWalletBMock } from "./mock";
import type { StarknetWindowObject } from "@starknet-io/types-js";

interface TestWindow extends Window {
  starknet_wallet_a?: typeof UnknownWalletAMock;
  starknet_wallet_b?: typeof UnknownWalletBMock;
  starknet_notawallet?: { notAWallet: boolean };
  starknet_incomplete?: Partial<StarknetWindowObject>;
}

const testWindow = window as TestWindow;

describe("Injected wallet discovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    testWindow.starknet_wallet_a = undefined;
    testWindow.starknet_wallet_b = undefined;
    testWindow.starknet_notawallet = undefined;
    testWindow.starknet_incomplete = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    testWindow.starknet_wallet_a = undefined;
    testWindow.starknet_wallet_b = undefined;
    testWindow.starknet_notawallet = undefined;
    testWindow.starknet_incomplete = undefined;
  });

  it("discovers wallets injected into the window object", () => {
    // Inject a wallet
    testWindow.starknet_wallet_a = UnknownWalletAMock;

    // Create the store
    const store = createStore();

    // Should find the injected wallet
    expect(store.getWallets()).toHaveLength(1);
    expect(store.getWallets()[0].name).toBe("Wallet A");
  });

  it("discovers multiple injected wallets", () => {
    // Inject multiple wallets
    testWindow.starknet_wallet_a = UnknownWalletAMock;
    testWindow.starknet_wallet_b = UnknownWalletBMock;

    // Create the store
    const store = createStore();

    // Should find both injected wallets
    expect(store.getWallets()).toHaveLength(2);

    const walletNames = store
      .getWallets()
      .map((w) => w.name)
      .sort();
    expect(walletNames).toEqual(["Wallet A", "Wallet B"]);
  });

  it("discovers wallets injected after store creation", () => {
    // Create the store with no wallets initially
    const store = createStore();

    // No wallets yet
    expect(store.getWallets()).toHaveLength(0);

    // Inject a wallet after store creation
    testWindow.starknet_wallet_a = UnknownWalletAMock;

    // Manually trigger refresh
    store._refreshInjectedWallets();

    // Should find the newly injected wallet
    expect(store.getWallets()).toHaveLength(1);
    expect(store.getWallets()[0].name).toBe("Wallet A");
  });

  it("ignores non-starknet objects in the window", () => {
    // Add a non-wallet object with a starknet prefix
    testWindow.starknet_notawallet = {
      notAWallet: true,
    };

    // Create the store
    const store = createStore();

    // Shouldn't find any wallets
    expect(store.getWallets()).toHaveLength(0);
  });

  it("handles wallets missing required properties", () => {
    // Add an incomplete wallet object
    testWindow.starknet_incomplete = {
      name: "Incomplete Wallet",
      id: "incomplete",
      // Missing other required properties
    };

    // Create the store
    const store = createStore();

    // Shouldn't find any wallets
    expect(store.getWallets()).toHaveLength(0);
  });
});
