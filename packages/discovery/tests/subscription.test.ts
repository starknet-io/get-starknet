// @vitest-environment happy-dom

import type { WalletWithStarknetFeatures } from "@starknet-io/get-starknet-wallet-standard/features";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "../src";
import { UnknownWalletAMock } from "./mock";

interface TestWindow extends Window {
  starknet_wallet_a?: typeof UnknownWalletAMock;
}

// Type cast window with our custom interface
const testWindow = window as TestWindow;

describe("Store subscription mechanism", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    testWindow.starknet_wallet_a = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    testWindow.starknet_wallet_a = undefined;
  });

  it("notifies subscribers when wallets change", () => {
    const store = createStore();

    // Create a subscriber
    const subscriber = vi.fn();
    store.subscribe(subscriber);

    // Initially not called (only called on changes)
    expect(subscriber).not.toHaveBeenCalled();

    // Inject a wallet after store creation
    testWindow.starknet_wallet_a = UnknownWalletAMock;

    // Trigger a wallet refresh
    store._refreshInjectedWallets();

    // Should be called with the updated wallets
    expect(subscriber).toHaveBeenCalledWith(store.getWallets());
  });

  it("allows unsubscribing", () => {
    const store = createStore();

    // Create a subscriber
    const subscriber = vi.fn();
    const unsubscribe = store.subscribe(subscriber);

    // Unsubscribe
    unsubscribe();

    // Trigger a wallet refresh
    store._refreshInjectedWallets();

    // Subscriber should not be called
    expect(subscriber).not.toHaveBeenCalled();
  });

  it("notifies multiple subscribers", () => {
    const store = createStore();

    // Create multiple subscribers
    const subscriber1 = vi.fn();
    const subscriber2 = vi.fn();

    store.subscribe(subscriber1);
    store.subscribe(subscriber2);

    // Inject a wallet after store creation
    testWindow.starknet_wallet_a = UnknownWalletAMock;

    // Trigger a wallet refresh
    store._refreshInjectedWallets();

    // Both subscribers should be called
    expect(subscriber1).toHaveBeenCalled();
    expect(subscriber2).toHaveBeenCalled();
  });

  it("subscribers get the correct wallet array", () => {
    const store = createStore();

    let subscriberWallets: readonly WalletWithStarknetFeatures[] = [];

    const subscriber = (wallets: readonly WalletWithStarknetFeatures[]) => {
      // Update the subscriberWallets array with the new wallets
      subscriberWallets = wallets;
    };

    // Subscribe to the store
    store.subscribe(subscriber);

    // Inject a wallet after store creation
    testWindow.starknet_wallet_a = UnknownWalletAMock;

    // Trigger a wallet refresh
    store._refreshInjectedWallets();

    // The subscriber should receive the same wallets as getWallets
    expect(subscriberWallets).toEqual(store.getWallets());
  });
});
