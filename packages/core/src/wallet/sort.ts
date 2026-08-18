import { WalletProvider } from "../discovery"
import { shuffle } from "../utils"
import { type StarknetWindowObject } from "@starknet-io/types-js"

export type Sort = string[] | "random" | null | undefined

export const sortBy = <T extends StarknetWindowObject | WalletProvider>(
  wallets: T[],
  sort: Sort,
): T[] => {
  if (sort && Array.isArray(sort)) {
    // skip default/preAuthorized priorities,
    // sort by client-specific order
    wallets.sort((a, b) => sort.indexOf(a.id) - sort.indexOf(b.id))

    // count only the wallets that are actually installed and named in `sort`;
    // `sort` may list ids the user does not have, and those must not shift the
    // split between the sorted and shuffled groups
    const sortScope =
      wallets.length -
      wallets.filter((wallet) => sort.includes(wallet.id)).length
    return [
      ...wallets.slice(sortScope),
      // shuffle wallets which are outside `sort` scope
      ...shuffle(wallets.slice(0, sortScope)),
    ]
  } else {
    return shuffle(wallets)
  }
}
