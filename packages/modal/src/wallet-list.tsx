import {
  StarknetWalletApi,
  type WalletWithStarknetFeatures,
} from "@starknet-io/get-starknet-wallet-standard/features";
import { braavos, readyWallet } from "@starknet-io/get-starknet-wallets";
import { useMemo } from "react";
import { getLastConnectedWalletId } from "./helper";
import type {
  AvailableWallet,
  MaybeWallet,
  UnavailableWallet,
} from "./maybe-wallet";
import { useStarknetProvider } from "./provider";
import { shuffle } from "./random";

export type SortAlgorithm =
  | "alpha-asc"
  | "alpha-desc"
  | "random"
  | "recommended";

const popularWallets = [readyWallet.id, braavos.id];

export type WalletListProps = {
  /** How to sort wallets */
  sortAlgorithm?: SortAlgorithm;
  children: (
    wallet: {
      isLastConnected: boolean;
      isSelected: boolean;
      select: () => void;
      type: string;
    } & MaybeWallet,
  ) => React.ReactNode;
};

/**
 * This component is used to display the list of wallets.
 *
 * @param WalletListProps - The props for the component.
 * @returns The list of wallets.
 *
 * @example
 *
 * ```tsx
 * import { WalletList } from "@starknet-io/get-starknet-modal";
 *
 * function Dapp() {
 *   return (
 *     <WalletList>
 *       {({
 *         isSelected,
 *         select,
 *         type,
 *         isLastConnected,
 *         ...wallet
 *       }) => <div>{wallet.name} - {wallet.type}</div>}
 *     </WalletList>
 *   );
 * }
 * ```
 */
export function WalletList({
  sortAlgorithm: userSortAlgorithm,
  children,
  ref,
  ...props
}: WalletListProps & Omit<React.ComponentProps<"div">, "children">) {
  const { wallets, selected, onSelectedChange } = useStarknetProvider();
  const sortAlgorithm = userSortAlgorithm ?? "recommended";

  const sortedWallets = useMemo(() => {
    const lastConnectedWalletId = getLastConnectedWalletId();

    if (sortAlgorithm === "alpha-asc") {
      return sortAlphabeticalAsc(wallets);
    }
    if (sortAlgorithm === "alpha-desc") {
      return sortAlphabeticalDesc(wallets);
    }
    if (sortAlgorithm === "random") {
      return sortRandom(wallets);
    }
    if (sortAlgorithm === "recommended") {
      return sortRecommended(wallets, lastConnectedWalletId);
    }
    throw new Error(`Invalid sort algorithm: ${sortAlgorithm}`);
  }, [wallets, sortAlgorithm]);

  const lastConnectedWalletId = getLastConnectedWalletId();

  return (
    <div ref={ref} {...props}>
      {sortedWallets.map((wallet) => {
        const type =
          wallet.state === "available"
            ? getWalletClassName(wallet.wallet)
            : "Unknown";
        return children?.({
          ...wallet,
          isLastConnected:
            wallet.state === "available"
              ? wallet.wallet.features[StarknetWalletApi].id ===
                lastConnectedWalletId
              : false,
          isSelected: selected && walletEq(wallet, selected.wallet),
          type,
          select: () => onSelectedChange({ wallet }),
        });
      })}
    </div>
  );
}

function sortAlphabeticalAsc(wallets: readonly MaybeWallet[]): MaybeWallet[] {
  return wallets.slice().sort((a, b) => a.name.localeCompare(b.name));
}

function sortAlphabeticalDesc(wallets: readonly MaybeWallet[]): MaybeWallet[] {
  return wallets.slice().sort((a, b) => b.name.localeCompare(a.name));
}

function sortRandom(wallets: readonly MaybeWallet[]): MaybeWallet[] {
  return shuffle(getOrInitSortSeed(), wallets);
}

function sortRecommended(
  wallets: readonly MaybeWallet[],
  lastConnectedWalletId: string | null,
): MaybeWallet[] {
  const availableWallets = wallets.filter(
    (w): w is AvailableWallet => w.state === "available",
  );
  const unavailableWallets = wallets.filter(
    (w): w is UnavailableWallet => w.state === "unavailable",
  );

  // Sort available wallets: last connected first, then random
  const sortedAvailable = sortAvailableWallets(
    availableWallets,
    lastConnectedWalletId,
  );

  // Sort unavailable wallets: popular first (max 4), then others
  const sortedUnavailable = sortUnavailableWallets(
    unavailableWallets,
    availableWallets,
  );

  return [...sortedAvailable, ...sortedUnavailable];
}

function sortAvailableWallets(
  wallets: AvailableWallet[],
  lastConnectedWalletId: string | null,
): AvailableWallet[] {
  const lastConnectedWallet = lastConnectedWalletId
    ? wallets.find(
        (w) =>
          w.wallet.features[StarknetWalletApi].id === lastConnectedWalletId,
      )
    : undefined;

  const otherWallets = wallets.filter(
    (w) =>
      !lastConnectedWalletId ||
      w.wallet.features[StarknetWalletApi].id !== lastConnectedWalletId,
  );

  const shuffledOthers = shuffle(getOrInitSortSeed(), otherWallets);

  return lastConnectedWallet
    ? [lastConnectedWallet, ...shuffledOthers]
    : shuffledOthers;
}

function sortUnavailableWallets(
  unavailableWallets: UnavailableWallet[],
  availableWallets: AvailableWallet[],
): UnavailableWallet[] {
  const installedWalletIds = new Set(
    availableWallets.map((w) => w.wallet.features[StarknetWalletApi].id),
  );

  const uninstalledPopularWallets = unavailableWallets.filter(
    (w) =>
      popularWallets.includes(w.info.id) && !installedWalletIds.has(w.info.id),
  );

  const shuffledPopular = shuffle(
    getOrInitSortSeed(),
    uninstalledPopularWallets,
  ).slice(0, 4);

  const otherWallets = unavailableWallets.filter(
    (w) =>
      !popularWallets.includes(w.info.id) || installedWalletIds.has(w.info.id),
  );

  const shuffledOthers = shuffle(getOrInitSortSeed(), otherWallets);

  return [...shuffledPopular, ...shuffledOthers];
}

function getOrInitSortSeed(): number {
  const storedSeed = localStorage.getItem("get-starknet-sort-seed");
  if (storedSeed !== null) {
    return Number(storedSeed);
  }

  const newSeed = Math.floor(Math.random() * 1_000_00);
  localStorage.setItem("get-starknet-sort-seed", newSeed.toString());
  return newSeed;
}

function walletEq(a: MaybeWallet, b: MaybeWallet) {
  return a.state === b.state && a.name === b.name;
}

function getWalletClassName(wallet: WalletWithStarknetFeatures) {
  return wallet.constructor.name;
}
