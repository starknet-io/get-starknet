import type {
  WalletEventsWindow,
  WindowRegisterWalletEvent,
  WindowAppReadyEvent,
  WindowAppReadyEventAPI,
  Wallet,
} from "@wallet-standard/base";

export function registerStandardWalletDiscovery(
  register: (wallet: Wallet) => () => void,
) {
  if (typeof window === "undefined") return;

  const api = Object.freeze({ register });

  const handler = ({ detail: callback }: WindowRegisterWalletEvent) => {
    callback(api);
  };

  (window as WalletEventsWindow).addEventListener(
    "wallet-standard:register-wallet",
    handler,
  );

  (window as WalletEventsWindow).dispatchEvent(new AppReadyEvent(api));

  return () =>
    (window as WalletEventsWindow).removeEventListener(
      "wallet-standard:register-wallet",
      handler,
    );
}

class AppReadyEvent extends Event implements WindowAppReadyEvent {
  constructor(public readonly detail: WindowAppReadyEventAPI) {
    super("wallet-standard:app-ready", {
      bubbles: false,
      cancelable: false,
      composed: false,
    });
  }

  get type() {
    return "wallet-standard:app-ready" as const;
  }

  preventDefault(): never {
    throw new Error("preventDefault is deprecated");
  }

  stopImmediatePropagation(): never {
    throw new Error("stopImmediatePropagation is deprecated");
  }

  stopPropagation(): never {
    throw new Error("stopPropagation is deprecated");
  }
}
