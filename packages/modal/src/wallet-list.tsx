import { useMemo } from "react";
import type { MaybeWallet } from "./maybe-wallet";
import { useStarknetProvider } from "./provider";
import { shuffle } from "./random";

export type SortAlgorithm = "alpha-asc" | "alpha-desc" | "random";

export type WalletListProps = {
  /** How to sort wallets */
  sortAlgorithm?: SortAlgorithm;
  children: (
    wallet: { isSelected: boolean; select: () => void } & MaybeWallet,
  ) => React.ReactNode;
};

export function WalletList({
  sortAlgorithm: userSortAlgorithm,
  children,
  ref,
  ...props
}: WalletListProps & Omit<React.ComponentProps<"div">, "children">) {
  const { wallets, selected, onSelectedChange } = useStarknetProvider();
  const sortAlgorithm = userSortAlgorithm ?? "alpha-asc";

  const sortedWallets = useMemo(() => {
    if (sortAlgorithm === "alpha-asc") {
      return sortAlphabeticalAsc(wallets);
    }
    if (sortAlgorithm === "alpha-desc") {
      return sortAlphabeticalDesc(wallets);
    }
    if (sortAlgorithm === "random") {
      return sortRandom(wallets);
    }
    throw new Error(`Invalid sort algorithm: ${sortAlgorithm}`);
  }, [wallets, sortAlgorithm]);

  return (
    <div ref={ref} {...props}>
      {sortedWallets.map((wallet) =>
        children?.({
          ...wallet,
          isSelected: selected && walletEq(wallet, selected.wallet),
          select: () => onSelectedChange({ wallet }),
        }),
      )}
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
