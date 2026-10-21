const LAST_CONNECTED_WALLET_KEY = "get-starknet.last-connected-wallet";
const SORT_SEED_KEY = "get-starknet.sort-seed";

export function getLastConnectedWalletId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const lastConnectedWalletId = window.localStorage.getItem(
    LAST_CONNECTED_WALLET_KEY,
  );
  return lastConnectedWalletId || null;
}

export function setLastConnectedWalletId(walletId: string | null) {
  if (typeof window === "undefined") {
    return;
  }
  if (walletId) {
    window.localStorage.setItem(LAST_CONNECTED_WALLET_KEY, walletId);
  } else {
    window.localStorage.removeItem(LAST_CONNECTED_WALLET_KEY);
  }
}

export function getOrInitSortSeed(): number {
  const now = Math.floor(Date.now() / 1000);
  const expirationSeconds = 600; // 10 minutes
  const stored = window.localStorage.getItem(SORT_SEED_KEY);

  function write(seed: number, timestamp: number) {
    window.localStorage.setItem(SORT_SEED_KEY, `${seed}:${timestamp}`);
    return seed;
  }

  if (stored) {
    const [seedStr, tsStr] = stored.split(":");
    const seed = Number(seedStr);
    const ts = Number(tsStr);
    if (Number.isFinite(seed) && Number.isFinite(ts)) {
      if (now - ts > expirationSeconds) {
        const newSeed = Math.floor(Math.random() * 1_000_00);
        return write(newSeed, now);
      }
      return write(seed, now);
    }
  }

  const newSeed = Math.floor(Math.random() * 1_000_00);
  return write(newSeed, now);
}
