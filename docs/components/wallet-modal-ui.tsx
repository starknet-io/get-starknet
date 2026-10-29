"use client";

import "./layer-order.css";
import {
  GetStarknetProvider,
  StarknetWalletApi,
  useConnect,
  WalletConnectModal,
} from "@starknet-io/get-starknet-ui";
import { useEffect } from "react";
import {
  useWebWallet,
  WebWalletConnectUi,
  WebWalletProvider,
} from "./web-wallet";

export default function WalletModalUiDemo() {
  useDarkClass();

  return (
    <WebWalletProvider>
      <DemoComponent />
    </WebWalletProvider>
  );
}

// The UI's dark theme keys off a `dark` class on the root element, while vocs
// only sets `color-scheme` there. Mirror the vocs theme onto the class.
function useDarkClass() {
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const scheme = root.style.colorScheme;
      root.classList.toggle(
        "dark",
        scheme === "dark" || (scheme !== "light" && media.matches),
      );
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["style"] });
    media.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", sync);
      root.classList.remove("dark");
    };
  }, []);
}

function DemoComponent() {
  const { wallet: webWallet } = useWebWallet();

  return (
    <GetStarknetProvider extraWallets={[webWallet]}>
      <WalletUser />
    </GetStarknetProvider>
  );
}

function WalletUser() {
  const { wallet: webWallet } = useWebWallet();

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      <WalletConnectModal
        walletUi={{
          [webWallet.features[StarknetWalletApi].id]: {
            viewPanel: (wallet) => <WebWalletConnectUi key={wallet.name} />,
          },
        }}
      />
      <ExampleNestedComponent />
    </div>
  );
}

function ExampleNestedComponent() {
  const { connected } = useConnect();

  return (
    <div className="p-32">
      <p>
        {connected && connected.accounts.length > 0
          ? connected.accounts[0].address
          : "Not connected"}
      </p>
    </div>
  );
}
