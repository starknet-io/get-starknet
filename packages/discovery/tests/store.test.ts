// @vitest-environment happy-dom

import { StarknetInjectedWallet } from "@starknet-io/get-starknet-wallet-standard";
import { registerWallet } from "@wallet-standard/core";
import { describe, expect, it } from "vitest";
import { createStore } from "../src";
import { UnknownWalletAMock, UnknownWalletBMock } from "./mock";

interface TestWindow extends Window {
  starknet_wallet_a?: typeof UnknownWalletAMock;
}

const testWindow = window as TestWindow;

testWindow.starknet_wallet_a = UnknownWalletAMock;

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
