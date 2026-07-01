import { StarknetWalletApi } from "@starknet-io/get-starknet-wallet-standard/features";
import type { StarknetWindowObject } from "@starknet-io/types-js";
import {
  StandardConnect,
  StandardDisconnect,
  StandardEvents,
} from "@wallet-standard/features";
import type { EIP1193Provider } from "viem";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  type MetaMaskProvider,
  MetaMaskVirtualWallet,
  metaMaskVirtualWallet,
} from "../src/metamask";
import type { EIP6963ProviderInfo } from "../src/types";

const createMockStarknetWindowObject = (): StarknetWindowObject => {
  return {
    name: "MetaMask Starknet",
    id: "metamask-starknet",
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

// Mock Modules: https://vitest.dev/api/vi.html#vi-mock
vi.mock("@module-federation/runtime", () => ({
  init: vi.fn().mockResolvedValue(undefined),
  loadRemote: vi.fn().mockResolvedValue({
    MetaMaskSnapWallet: function MockMetamaskSnapWallet() {
      return createMockStarknetWindowObject();
    },
  }),
}));

describe("metaMaskVirtualWallet", () => {
  it("creates a wallet for MetaMask providers", () => {
    const validProvider: EIP1193Provider & MetaMaskProvider = {
      isMetaMask: true,
      on: vi.fn(),
      removeListener: vi.fn(),
      request: vi.fn(),
    };
    const validInfo: EIP6963ProviderInfo = { rdns: "io.metamask" };

    // should create wallet for valid inputs
    const wallet = metaMaskVirtualWallet(validInfo, validProvider);
    expect(wallet).not.toBeNull();

    // should accept MetaMask Flask too
    const flaskWallet = metaMaskVirtualWallet(
      { rdns: "io.metamask.flask" },
      validProvider,
    );
    expect(flaskWallet).not.toBeNull();

    expect(
      metaMaskVirtualWallet({ rdns: "some.other.wallet" }, validProvider),
    ).toBeNull();

    const invalidProvider: Partial<EIP1193Provider> = {
      on: vi.fn(),
      removeListener: vi.fn(),
    };
    expect(
      metaMaskVirtualWallet(validInfo, invalidProvider as EIP1193Provider),
    ).toBeNull();
  });
});

describe("MetaMaskVirtualWallet", () => {
  let mockProvider: MetaMaskProvider;
  let wallet: MetaMaskVirtualWallet;

  beforeEach(() => {
    vi.clearAllMocks();

    mockProvider = {
      isMetaMask: true,
      request: vi.fn(),
    };

    wallet = new MetaMaskVirtualWallet(mockProvider);
  });

  it("has the correct properties", () => {
    expect(wallet.version).toBe("1.0.0");
    expect(wallet.name).toBe("MetaMask");
    expect(wallet.icon).toBeDefined();
    expect(wallet.accounts).toEqual([]);
    expect(wallet.chains).toContain("starknet:0x534e5f4d41494e");
    expect(wallet.chains).toContain("starknet:0x534e5f5345504f4c4941");
  });

  it("implements all required wallet features", () => {
    const features = wallet.features;
    expect(features[StarknetWalletApi]).toBeDefined();
    expect(features[StandardConnect]).toBeDefined();
    expect(features[StandardDisconnect]).toBeDefined();
    expect(features[StandardEvents]).toBeDefined();
  });

  it("can connect and disconnect", async () => {
    // Connect
    const result = await wallet.features[StandardConnect].connect({
      silent: false,
    });

    expect(result.accounts).toHaveLength(1);
    expect(wallet.accounts).toHaveLength(1);

    // Disconnect
    await wallet.features[StandardDisconnect].disconnect();

    expect(wallet.accounts).toHaveLength(0);
  });

  it("handles events with listeners", async () => {
    // Set up a listener
    const changeListener = vi.fn();
    const on = wallet.features[StandardEvents].on;
    const off = on("change", changeListener);

    // Connect (should trigger change event)
    await wallet.features[StandardConnect].connect({ silent: false });

    // Listener should have been called
    expect(changeListener).toHaveBeenCalled();

    // Remove listener
    off();

    // Reset mock
    changeListener.mockClear();

    // Disconnect (should trigger change again, but listener was removed)
    await wallet.features[StandardDisconnect].disconnect();

    // Listener should not have been called again
    expect(changeListener).not.toHaveBeenCalled();
  });
});
