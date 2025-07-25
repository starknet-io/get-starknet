"use client";

import { GetStarknetProvider } from "@starknet-io/get-starknet-modal";
import { WalletConnectModal } from "@starknet-io/get-starknet-ui";
import { StarknetWalletApi } from "@starknet-io/get-starknet-wallet-standard/features";
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
    </div>
  );
}
