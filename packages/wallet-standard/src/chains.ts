import type { IdentifierString } from "@wallet-standard/base";

/** Starknet mainnet. */
export const STARKNET_MAINNET_CHAIN = "starknet:mainnet";

/** Starknet sepolia. */
export const STARKNET_SEPOLIA_CHAIN = "starknet:sepolia";

/** Starknet devnet, e.g. starknet-devnet-rs or katana. */
export const STARKNET_DEVNET_CHAIN = "starknet:devnet";

export const STARKNET_CHAINS = [
  STARKNET_MAINNET_CHAIN,
  STARKNET_SEPOLIA_CHAIN,
  STARKNET_DEVNET_CHAIN,
] as const satisfies IdentifierString[];

export type StarknetChain = (typeof STARKNET_CHAINS)[number];

/** Check if a chain is a known Starknet chain. */
export function isStarknetChain(
  chain: IdentifierString,
): chain is StarknetChain {
  return STARKNET_CHAINS.includes(chain as StarknetChain);
}
