import { Hex } from "ox";

export type ChainId = `0x${string}`;

export const STARKNET_CHAIN_PREFIX = "starknet:";

export type StarknetChain = `${typeof STARKNET_CHAIN_PREFIX}${ChainId}`;

export class StarknetChainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StarknetChainError";
  }
}

export const WELL_KNOWN_STARKNET_CHAINS = [
  "starknet:0x534e5f4d41494e", // mainnet
  "starknet:0x534e5f5345504f4c4941", // sepolia
] as const satisfies StarknetChain[];

/** Check if a chain identifier is a Starknet chain. */
export function isStarknetChain(chain: string): chain is StarknetChain {
  const parts = chain.split(":");
  if (parts.length !== 2 || parts[0] !== "starknet") {
    return false;
  }

  return Hex.validate(parts[1]);
}

/** Returns a `StarknetChain` from a `ChainId`. */
export function formatStarknetChainId(chainId: string): StarknetChain {
  if (!Hex.validate(chainId)) {
    throw new StarknetChainError(`Invalid Starknet chain id: ${chainId}`);
  }
  return `${STARKNET_CHAIN_PREFIX}${chainId}`;
}

/** Returns the 0x prefixed chain id. */
export function getStarknetChainId(chain: string): ChainId {
  if (!isStarknetChain(chain)) {
    throw new StarknetChainError(`Invalid Starknet chain: ${chain}`);
  }
  return chain.slice(STARKNET_CHAIN_PREFIX.length) as ChainId;
}
