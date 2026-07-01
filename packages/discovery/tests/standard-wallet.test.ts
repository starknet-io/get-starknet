// @vitest-environment happy-dom

import type { WindowRegisterWalletEventCallback } from "@wallet-standard/base";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "../src";
import { createMockStandardWallet } from "./mock";

describe("Standard wallet discovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registers wallets that announce themselves via the standard event", () => {
    const store = createStore();

    // Initial state - no wallets
    expect(store.getWallets()).toHaveLength(0);

    // Simulate a wallet trying to register itself
    const mockWallet = createMockStandardWallet("Standard Wallet");

    // Create and dispatch a register-wallet event
    const registerCallback: WindowRegisterWalletEventCallback = (api) => {
      api.register(mockWallet);
    };

    const event = new CustomEvent("wallet-standard:register-wallet", {
      detail: registerCallback,
    });

    window.dispatchEvent(event);

    // Should now have the wallet
    expect(store.getWallets()).toHaveLength(1);
    expect(store.getWallets()[0].name).toBe("Standard Wallet");
  });

  it("emits app-ready event during initialization", () => {
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    // Create a new store (this should dispatch the app-ready event)
    createStore();

    // Verify the event was dispatched
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "wallet-standard:app-ready",
      }),
    );
  });

  it("processes multiple wallet registrations", () => {
    const store = createStore();

    // Register two different wallets
    const wallet1 = createMockStandardWallet("Wallet One");
    const wallet2 = createMockStandardWallet("Wallet Two");

    // Register the first wallet
    const registerCallback1: WindowRegisterWalletEventCallback = (api) => {
      api.register(wallet1);
    };

    window.dispatchEvent(
      new CustomEvent("wallet-standard:register-wallet", {
        detail: registerCallback1,
      }),
    );

    // Register the second wallet
    const registerCallback2: WindowRegisterWalletEventCallback = (api) => {
      api.register(wallet2);
    };

    window.dispatchEvent(
      new CustomEvent("wallet-standard:register-wallet", {
        detail: registerCallback2,
      }),
    );

    // Should have both wallets
    expect(store.getWallets()).toHaveLength(2);
    expect(
      store
        .getWallets()
        .map((w) => w.name)
        .sort(),
    ).toEqual(["Wallet One", "Wallet Two"]);
  });
});
