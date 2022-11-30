import { StarknetWindowObject } from "../StarknetWindowObject"
import { WalletProvider } from "../discovery"

export type FilterList = string[]
interface FilterByOptions {
  include?: FilterList
  exclude?: FilterList
}

export function filterBy<T extends StarknetWindowObject | WalletProvider>(
  installed: T[],
  options?: FilterByOptions,
): T[] {
  if (options?.include?.length) {
    const included = new Set<string>(options.include)
    return installed.filter((w) => included.has(w.id))
  }

  if (options?.exclude?.length) {
    const excluded = new Set<string>(options.exclude)
    return installed.filter((w) => !excluded.has(w.id))
  }

  return installed
}

/**
 * filters given wallets array, return only preAuthorized instances
 * @param wallets
 */
export const filterByPreAuthorized = async (
  wallets: StarknetWindowObject[],
): Promise<StarknetWindowObject[]> => {
  const preAuthResponses = await Promise.all(
    wallets.map((w) => w.isPreauthorized().catch(() => false)),
  )
  return wallets.filter((_, i) => preAuthResponses[i])
}
