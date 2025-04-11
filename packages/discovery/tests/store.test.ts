// @vitest-environment happy-dom

import { describe, it, expect } from "vitest";
import { registerWallet } from "@wallet-standard/core";
import { UnknownWalletAMock, UnknownWalletBMock } from "./mock";
import { StarknetInjectedWallet } from "@starknet-io/get-starknet-wallet-standard";
import { createStore } from "../src";

// biome-ignore lint/suspicious/noExplicitAny: assignment to window
(window as any).starknet_wallet_a = UnknownWalletAMock;

describe("createStore", () => {
  it("detects injected wallets", () => {
    const store = createStore();

    expect(store.getWallets().map((w) => w.name)).toMatchInlineSnapshot(`
          [
            "Wallet A",
          ]
        `);
  });

  it("automatically refreshes wallets that inject themselves", () => {
    const store = createStore();

    expect(store.getWallets()).toHaveLength(1);

    registerWallet(new StarknetInjectedWallet(UnknownWalletBMock));

    expect(store.getWallets().map((w) => w.name)).toMatchInlineSnapshot(`
          [
            "Wallet B",
            "Wallet A",
          ]
        `);
  });
});
