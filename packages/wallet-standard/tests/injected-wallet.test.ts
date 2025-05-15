import type { StarknetWindowObject } from "@starknet-io/types-js";
import {
  StandardConnect,
  StandardDisconnect,
  StandardEvents,
} from "@wallet-standard/features";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StarknetWalletApi } from "../src/features";
import { StarknetInjectedWallet } from "../src/injected-wallet";

// Mock functions: https://vitest.dev/api/mock.html#mock-functions

const createMockStarknetWindowObject = (): StarknetWindowObject => {
  return {
    name: "Mock Starknet Wallet",
    id: "mock-wallet",
    version: "1.0.0",
    icon: "data:image/svg+xml;base64,mock",
    request: vi.fn().mockImplementation(async ({ type }) => {
      if (type === "wallet_requestAccounts") {
        return ["0x123"];
      }
      if (type === "wallet_requestChainId") {
        return "0x534e5f4d41494e"; // SN_MAIN
      }
      return false;
    }),
    on: vi.fn(),
    off: vi.fn(),
  } satisfies StarknetWindowObject;
};

describe("StarknetInjectedWallet", () => {
  let mockInjected: StarknetWindowObject;
  let wallet: StarknetInjectedWallet;

  beforeEach(() => {
    mockInjected = createMockStarknetWindowObject();
    wallet = new StarknetInjectedWallet(mockInjected);
  });

  describe("properties", () => {
    it("has the correct version", () => {
      expect(wallet.version).toBe("1.0.0");
    });

    it("inherits name from injected wallet", () => {
      expect(wallet.name).toBe(mockInjected.name);
    });

    it("inherits icon from injected wallet", () => {
      expect(wallet.icon).toBe(mockInjected.icon);
    });

    it("has empty accounts when not connected", () => {
      expect(wallet.accounts).toEqual([]);
    });

    it("includes known Starknet chains", () => {
      expect(wallet.chains).toContain("starknet:0x534e5f4d41494e");
      expect(wallet.chains).toContain("starknet:0x534e5f5345504f4c4941");
    });
  });

  describe("features", () => {
    it("implements all required Starknet features", () => {
      const features = wallet.features;

      expect(features[StarknetWalletApi]).toBeDefined();
      expect(features[StarknetWalletApi].version).toBe("1.0.0");
      expect(features[StarknetWalletApi].walletVersion).toBe(
        mockInjected.version,
      );
      expect(features[StarknetWalletApi].request).toBeDefined();

      expect(features[StandardConnect]).toBeDefined();
      expect(features[StandardConnect].version).toBe("1.0.0");
      expect(features[StandardConnect].connect).toBeDefined();

      expect(features[StandardDisconnect]).toBeDefined();
      expect(features[StandardDisconnect].version).toBe("1.0.0");
      expect(features[StandardDisconnect].disconnect).toBeDefined();

      expect(features[StandardEvents]).toBeDefined();
      expect(features[StandardEvents].version).toBe("1.0.0");
      expect(features[StandardEvents].on).toBeDefined();
    });
  });

  describe("connect/disconnect", () => {
    it("connects to wallet and populates accounts", async () => {
      const result = await wallet.features[StandardConnect].connect({
        silent: false,
      });

      expect(mockInjected.request).toHaveBeenCalledWith({
        type: "wallet_requestAccounts",
        params: { silent_mode: false },
      });

      expect(result.accounts).toHaveLength(1);
      expect(result.accounts[0].address).toBe("0x123");
      expect(result.accounts[0].chains).toContain("starknet:0x534e5f4d41494e");
      expect(wallet.accounts).toEqual(result.accounts);
    });

    it("handles silent connection mode", async () => {
      await wallet.features[StandardConnect].connect({ silent: true });

      expect(mockInjected.request).toHaveBeenCalledWith({
        type: "wallet_requestAccounts",
        params: { silent_mode: true },
      });
    });

    it("disconnects from wallet and clears accounts", async () => {
      // First connect
      await wallet.features[StandardConnect].connect({ silent: false });
      expect(wallet.accounts).toHaveLength(1);

      // Then disconnect
      await wallet.features[StandardDisconnect].disconnect();

      expect(wallet.accounts).toHaveLength(0);
    });
  });

  describe("events", () => {
    it("emits change event when accounts change", async () => {
      await wallet.features[StandardConnect].connect({ silent: false });

      const changeListener = vi.fn();

      wallet.features[StandardEvents].on("change", changeListener);

      // we're finding the callback function that our wallet registered with the injected wallet
      // (callbacks registered in the constructor of StarknetInjectedWallet)
      const accountsChangedHandler = (
        mockInjected.on as ReturnType<typeof vi.fn>
      ).mock.calls.find((call) => call[0] === "accountsChanged")[1];

      // we're simulating the injected wallet calling the callback function
      accountsChangedHandler(["0x456"]);

      expect(changeListener).toHaveBeenCalled();
      expect(wallet.accounts[0].address).toBe("0x456");
    });

    it("emits change event when network changes", async () => {
      await wallet.features[StandardConnect].connect({ silent: false });

      const changeListener = vi.fn();

      wallet.features[StandardEvents].on("change", changeListener);

      /// we're finding the callback function that our wallet registered with the injected wallet
      // (callbacks registered in the constructor of StarknetInjectedWallet)
      const networkChangedHandler = (
        mockInjected.on as ReturnType<typeof vi.fn>
      ).mock.calls.find((call) => call[0] === "networkChanged")[1];

      networkChangedHandler("0x534e5f5345504f4c4941", ["0x123"]);

      expect(changeListener).toHaveBeenCalled();
      expect(wallet.accounts[0].chains[0]).toBe(
        "starknet:0x534e5f5345504f4c4941",
      );
    });

    it("allows removing event listeners", async () => {
      const changeListener = vi.fn();
      const off = wallet.features[StandardEvents].on("change", changeListener);

      // Remove the listener
      off();

      // Trigger connect (which would emit a change event)
      await wallet.features[StandardConnect].connect({ silent: false });

      expect(changeListener).not.toHaveBeenCalled();
    });
  });

  describe("request functionality", () => {
    it("passes requests to the injected wallet", async () => {
      await wallet.features[StarknetWalletApi].request({
        type: "wallet_requestChainId",
      });

      expect(mockInjected.request).toHaveBeenCalledWith({
        type: "wallet_requestChainId",
      });
    });
  });
});
