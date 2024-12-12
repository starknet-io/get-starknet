import type { IdentifierString } from "@wallet-standard/base";
import { Hex } from "ox";

export type ChainId = `0x${string}`;

export const STARKNET_CHAIN_PREFIX = "starknet:";

export type StarknetChain = `${typeof STARKNET_CHAIN_PREFIX}${ChainId}`;

export const WELL_KNOWN_STARKNET_CHAINS = [] as const satisfies StarknetChain[];

/** Check if a chain is a known Starknet chain. */
export function isStarknetChain(
  chain: IdentifierString,
): chain is StarknetChain {
  const parts = chain.split(":");
  if (parts.length !== 2 || parts[0] !== "starknet") {
    return false;
  }

  return Hex.validate(parts[1]);
}

/** Returns the 0x prefixed chain id. */
export function getStarknetChainId(chain: StarknetChain): ChainId {
  const [, id] = chain.split(":");
  Hex.assert(id);
  return id as ChainId;
}
