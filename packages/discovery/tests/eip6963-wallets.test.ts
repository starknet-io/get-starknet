// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "../src";
import { createMockStandardWallet } from "./mock";

describe("EIP6963 wallet discovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("discovers EIP6963 MetaMask wallet when it announces itself", () => {
    const store = createStore();
    // Initial state - no wallets
    expect(store.getWallets()).toHaveLength(0);

    // Simulate an EIP6963 provider announcement (MetaMask)
    const metamaskInfo = { rdns: "io.metamask" };
    const metamaskProvider = {
      isMetaMask: true, // This is a required property for MetaMask
      request: vi.fn(),
      on: vi.fn(),
      removeListener: vi.fn(),
    };

    // Create and dispatch the custom event
    const event = new CustomEvent("eip6963:announceProvider", {
      detail: {
        info: metamaskInfo,
        provider: metamaskProvider,
      },
    });
    window.dispatchEvent(event);

    // Should now have the MetaMask wallet
    expect(store.getWallets()).toHaveLength(1);
    expect(store.getWallets()[0].name).toBe("MetaMask");
  });

  it("discovers other EIP6963 wallets when they announce themselves", () => {
    const store = createStore({
      eip1193Adapters: [
        (info, provider) => {
          if (info.rdns === "com.example.wallet") {
            return createMockStandardWallet("Unknown EIP6963 Wallet");
          }
        },
      ],
    });

    // Initial state - no wallets
    expect(store.getWallets()).toHaveLength(0);

    // Simulate an EIP6963 provider announcement
    const info = { rdns: "com.example.wallet" };
    const provider = {
      request: vi.fn(),
      on: vi.fn(),
      removeListener: vi.fn(),
    };

    // Create and dispatch the custom event
    const event = new CustomEvent("eip6963:announceProvider", {
      detail: { info, provider },
    });
    window.dispatchEvent(event);

    // Should now have the Example EIP6963 wallet
    expect(store.getWallets()).toHaveLength(1);
    expect(store.getWallets()[0].name).toBe("Unknown EIP6963 Wallet");
  });

  it("ignores providers that don't match any adapters", () => {
    const store = createStore();

    // Initial state - no wallets
    expect(store.getWallets()).toHaveLength(0);

    // Simulate an EIP6963 provider announcement for an unsupported wallet
    const unknownInfo = { rdns: "com.unknown.wallet" };
    const unknownProvider = {
      request: vi.fn(),
      on: vi.fn(),
      removeListener: vi.fn(),
    };

    // Create and dispatch the custom event
    const event = new CustomEvent("eip6963:announceProvider", {
      detail: {
        info: unknownInfo,
        provider: unknownProvider,
      },
    });
    window.dispatchEvent(event);

    // Should still have no wallets
    expect(store.getWallets()).toHaveLength(0);
  });

  it("should dispatch a requestProvider event during initialization", () => {
    // Mock the dispatchEvent method
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    // Create a new store (this should trigger the requestProvider event)
    createStore();

    // Check that the appropriate event was dispatched
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "eip6963:requestProvider",
      }),
    );
  });
});
