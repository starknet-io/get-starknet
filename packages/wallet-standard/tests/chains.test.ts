import { describe, expect, it } from "vitest";
import {
  formatStarknetChainId,
  getStarknetChainId,
  isStarknetChain,
  WELL_KNOWN_STARKNET_CHAINS,
} from "../src/chains";

describe("isStarknetChain", () => {
  it("returns true if it's a valid starknet chain id", () => {
    expect(isStarknetChain("starknet:0x1234")).toBeTruthy();
  });

  it("returns false if it's not a valid starknet chain id", () => {
    expect(isStarknetChain("ethereum:0x1234")).toBeFalsy();
  });

  it("returns false for malformed chains", () => {
    expect(isStarknetChain("starknet-0x1234")).toBeFalsy();
    expect(isStarknetChain("starknet:")).toBeFalsy();
    expect(isStarknetChain("starknet:invalid")).toBeFalsy();
    expect(isStarknetChain("0x1234")).toBeFalsy();
  });
});

describe("getStarknetChainId", () => {
  it("returns the 0x prefixed chain id", () => {
    expect(getStarknetChainId("starknet:0x1234")).toBe("0x1234");
  });

  it("throws for invalid chains", () => {
    expect(() => getStarknetChainId("ethereum:0x1234")).toThrow();
    expect(() => getStarknetChainId("starknet-0x1234")).toThrow();
    expect(() => getStarknetChainId("starknet:")).toThrow();
    expect(() => getStarknetChainId("starknet:invalid")).toThrow();
    expect(() => getStarknetChainId("0x1234")).toThrow();
  });
});

describe("formatStarknetChainId", () => {
  it("formats a chain ID", () => {
    expect(formatStarknetChainId("0x1234")).toBe("starknet:0x1234");
  });

  it("throws for invalid hex strings", () => {
    expect(() => formatStarknetChainId("invalid")).toThrow();
  });
});

describe("WELL_KNOWN_STARKNET_CHAINS", () => {
  it("includes mainnet", () => {
    expect(WELL_KNOWN_STARKNET_CHAINS).toContain("starknet:0x534e5f4d41494e");
  });

  it("includes sepolia", () => {
    expect(WELL_KNOWN_STARKNET_CHAINS).toContain(
      "starknet:0x534e5f5345504f4c4941",
    );
  });

  it("has the correct number of chains", () => {
    expect(WELL_KNOWN_STARKNET_CHAINS.length).toBe(2);
  });
});
