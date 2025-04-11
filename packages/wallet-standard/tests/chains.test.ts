import { describe, it, expect } from "vitest";
import { getStarknetChainId, isStarknetChain } from "../src/chains";

describe("isStarknetChain", () => {
  it("returns true if it's a valid starknet chain id", () => {
    expect(isStarknetChain("starknet:0x1234")).toBeTruthy();
  });

  it("returns false if it's not a valid starknet chain id", () => {
    expect(isStarknetChain("ethereum:0x1234")).toBeFalsy();
  });
});

describe("getStarknetChainId", () => {
  it("returns the 0x prefixed chain id", () => {
    expect(getStarknetChainId("starknet:0x1234")).toBe("0x1234");
  });
});
