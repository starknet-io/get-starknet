"use client";

import {
  GetStarknetProvider,
  WalletConnectModal,
  StarknetWalletApi,
  useConnect,
} from "@starknet-io/get-starknet-ui";
import {
  useWebWallet,
  WebWalletConnectUi,
  WebWalletProvider,
} from "./web-wallet";

export default function WalletModalUiDemo() {
  return (
    <WebWalletProvider>
      <DemoComponent />
    </WebWalletProvider>
  );
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
