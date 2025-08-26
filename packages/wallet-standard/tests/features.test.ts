import type { Wallet } from "@wallet-standard/base";
import {
  StandardConnect,
  StandardDisconnect,
  StandardEvents,
} from "@wallet-standard/features";
import { describe, expect, it } from "vitest";
import { WELL_KNOWN_STARKNET_CHAINS } from "../src/chains";
import {
  isStarknetWallet,
  RequiredStarknetFeatures,
  type StarknetFeatures,
  StarknetWalletApi,
} from "../src/features";

const createMockWallet = (features: Partial<StarknetFeatures>): Wallet => ({
  version: "1.0.0",
  name: "Mock Wallet",
  icon: "data:image/svg+xml;base64,mock",
  chains: WELL_KNOWN_STARKNET_CHAINS,
  accounts: [],
  features,
});

describe("isStarknetWallet", () => {
  it("returns true for a wallet with all required features", () => {
    const wallet = createMockWallet({
      [StarknetWalletApi]: {
        id: "mock-wallet",
        version: "1.0.0",
        request: async () => "",
        walletVersion: "1.0.0",
      },
      [StandardConnect]: {
        version: "1.0.0",
        connect: async () => ({ accounts: [] }),
      },
      [StandardDisconnect]: {
        version: "1.0.0",
        disconnect: async () => {},
      },
      [StandardEvents]: {
        version: "1.0.0",
        on: () => () => {},
      },
    });

    expect(isStarknetWallet(wallet)).toBeTruthy();
  });

  it("returns false for a wallet missing required features", () => {
    // Missing StarknetWalletApi
    const wallet1 = createMockWallet({
      [StandardConnect]: {
        version: "1.0.0",
        connect: async () => ({ accounts: [] }),
      },
      [StandardDisconnect]: {
        version: "1.0.0",
        disconnect: async () => {},
      },
      [StandardEvents]: {
        version: "1.0.0",
        on: () => () => {},
      },
    });

    expect(isStarknetWallet(wallet1)).toBeFalsy();

    // Missing StandardConnect
    const wallet2 = createMockWallet({
      [StarknetWalletApi]: {
        id: "mock-wallet",
        version: "1.0.0",
        request: async () => "",
        walletVersion: "1.0.0",
      },
      // @ts-expect-error
      [StandardDisconnect]: {
        version: "1.0.0",
      },
      [StandardEvents]: {
        version: "1.0.0",
        on: () => () => {},
      },
    });

    expect(isStarknetWallet(wallet2)).toBeFalsy();
  });
});

describe("RequiredStarknetFeatures", () => {
  it("contains all necessary features", () => {
    expect(RequiredStarknetFeatures).toContain(StarknetWalletApi);
    expect(RequiredStarknetFeatures).toContain(StandardConnect);
    expect(RequiredStarknetFeatures).toContain(StandardDisconnect);
    expect(RequiredStarknetFeatures).toContain(StandardEvents);
    expect(RequiredStarknetFeatures.length).toBe(4);
  });
});
