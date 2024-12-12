import type { EIP1193Adapter } from "@get-starknet/virtual-wallet";
import type { Wallet } from "@wallet-standard/base";

export function registerEIP1193WalletFromEIP6963Discovery(
  eip1193Adapters: EIP1193Adapter[],
  register: (wallet: Wallet) => () => void,
) {
  if (typeof window === "undefined") return;

  const handler = (event: CustomEvent) => {
    const { info, provider } = event.detail;
    for (const adapter of eip1193Adapters) {
      const wallet = adapter(info, provider);
      if (wallet) {
        register(wallet);
        return;
      }
    }
  };

  window.addEventListener("eip6963:announceProvider", handler);

  window.dispatchEvent(new Event("eip6963:requestProvider"));

  return () => window.removeEventListener("eip6963:announceProvider", handler);
}
