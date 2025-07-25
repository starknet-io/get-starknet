const LAST_CONNECTED_WALLET_KEY = "starknetLastConnectedWallet";

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
