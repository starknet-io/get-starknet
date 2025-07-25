import {
  type AvailableWallet,
  SelectedWallet,
  type UnavailableWallet,
  useConnect,
  WalletList,
} from "@starknet-io/get-starknet-modal";
import {
  StarknetWalletApi,
  type WalletWithStarknetFeatures,
} from "@starknet-io/get-starknet-wallet-standard/features";
import {
  AlertCircle,
  Check,
  CheckCircle,
  CopyIcon,
  Loader2,
  LogOut,
  X,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Button } from "~ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~ui/components/ui/dialog";
import { Badge } from "./components/ui/badge";
import { useCopyToClipboard } from "./hooks/use-copy";
import { cn } from "./lib/utils";
import { LogosAndroidIcon } from "./logos/android";
import { LogosApple } from "./logos/apple";
import { LogosChrome } from "./logos/chrome";
import { LogosMicrosoftEdge } from "./logos/edge";
import { LogosFirefox } from "./logos/firefox";
import { LogosSafari } from "./logos/safari";
import { TokenBrandedStarknet } from "./logos/starknet";

export type WalletUi = {
  viewPanel: (wallet: AvailableWallet) => React.ReactNode;
};

export type WalletUiMap = {
  [walletId: string]: WalletUi;
};

export type WalletConnectModalProps = {
  walletUi?: WalletUiMap;
  buttonClassName?: string;
  dialogContentClassName?: string;
};

/**
 * This component is used to display the wallet connect button and modal.
 *
 * @param WalletConnectModalProps - The props for the component.
 * @returns The wallet connect button and modal.
 *
 * @example
 *
 * ```tsx
 * import { WalletConnectModal } from "@starknet-io/get-starknet-ui";
 *
 * function Dapp() {
 *   return <WalletConnectModal />;
 * }
 * ```
 */
export function WalletConnectModal({
  walletUi,
  buttonClassName,
  dialogContentClassName,
}: WalletConnectModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { connected, connect, disconnect } = useConnect();

  const connectWallet = useCallback(
    (wallet: WalletWithStarknetFeatures) => {
      if (connected || walletUi?.[wallet.features[StarknetWalletApi].id]) {
        return;
      }
      connect(wallet);
    },
    [connected, walletUi, connect],
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (connected) {
      timeoutId = setTimeout(() => {
        setIsOpen(false);
      }, 0);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [connected]);

  const [copy, isCopied] = useCopyToClipboard();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="get-starknet-ui">
        <DialogTrigger asChild>
          <Button
            onClick={() => setIsOpen(true)}
            className={cn(buttonClassName)}>
            {connected && connected.accounts.length > 0 ? (
              <span>
                <span className="gs:font-medium">
                  {connected.accounts[0].address.slice(0, 6)}...
                  {connected.accounts[0].address.slice(-4)}
                </span>
              </span>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "gs:sm:max-w-[800px] get-starknet-ui gs:overflow-hidden gs:p-0 gs:border-foreground/20 gs:gap-0",
            dialogContentClassName,
          )}>
          <div className="gs:h-full gs:grid gs:grid-cols-[300px_1fr] gs:gap-0">
            {/* Left Column */}
            <div className="gs:flex gs:flex-col gs:h-[500px] gs:border-r gs:border-foreground/20">
              {/* Header */}
              <div className="gs:flex-shrink-0 gs:p-4 gs:bg-background gs:h-[90px]">
                <DialogTitle className="gs:text-lg gs:leading-none gs:font-semibold gs:mb-2">
                  {connected
                    ? `Connected to ${connected.name}`
                    : "Connect Wallet"}
                </DialogTitle>
                <DialogDescription className="gs:text-muted-foreground gs:text-sm">
                  {connected && connected.accounts.length > 0 ? (
                    <div className="gs:flex gs:items-center gs:gap-2">
                      <Button
                        variant="secondary"
                        size={"sm"}
                        className="gs:flex-1"
                        onClick={() => {
                          copy(connected.accounts[0].address);
                        }}>
                        {isCopied ? (
                          <Check className="gs:size-4" />
                        ) : (
                          <CopyIcon className="gs:size-4" />
                        )}
                        <span className="gs:text-sm gs:font-medium">
                          {connected.accounts[0].address.slice(0, 6)}...
                          {connected.accounts[0].address.slice(-4)}
                        </span>
                      </Button>
                      <Button
                        variant="secondary"
                        size={"sm"}
                        onClick={() => {
                          disconnect();
                          setIsOpen(false);
                        }}>
                        <LogOut className="gs:size-4" />
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    "Select a wallet to connect to Starknet."
                  )}
                </DialogDescription>
              </div>

              {/* Wallet List */}
              <div className="gs:overflow-y-auto gs:styled-scrollbar gs:h-[410px]">
                <p className="gs:text-xs gs:font-semibold gs:text-muted-foreground gs:px-4 gs:my-2">
                  Available Wallets
                </p>
                <WalletList
                  className="gs:flex gs:flex-col gs:gap-1 gs:px-4"
                  sortAlgorithm="recommended">
                  {({
                    isSelected,
                    select,
                    type,
                    isLastConnected,
                    ...wallet
                  }) => {
                    return wallet.state === "available" ? (
                      <WalletItem
                        key={wallet.name}
                        wallet={wallet}
                        isSelected={isSelected}
                        select={select}
                        type={type}
                        isAvailable={true}
                        isLastConnected={isLastConnected}
                        onClick={() => {
                          connectWallet(wallet.wallet);
                        }}
                      />
                    ) : (
                      <Fragment key={wallet.name} />
                    );
                  }}
                </WalletList>

                <p className="gs:text-xs gs:font-semibold gs:text-muted-foreground gs:px-4 gs:my-2">
                  More Wallets
                </p>
                <WalletList
                  className="gs:flex gs:flex-col gs:gap-1 gs:px-4"
                  sortAlgorithm="recommended">
                  {({
                    isSelected,
                    select,
                    type,
                    isLastConnected,
                    ...wallet
                  }) => {
                    return wallet.state !== "available" ? (
                      <WalletItem
                        key={wallet.name}
                        wallet={wallet}
                        isSelected={isSelected}
                        select={select}
                        type={type}
                        isAvailable={false}
                        isLastConnected={isLastConnected}
                      />
                    ) : (
                      <Fragment key={wallet.name} />
                    );
                  }}
                </WalletList>
              </div>
            </div>

            {/* Right Column - Info Panel */}
            <SelectedWalletUi
              walletUi={walletUi}
              handleConnect={connectWallet}
            />
          </div>

          <DialogClose>
            <Button
              variant="secondary"
              size={"icon"}
              className="gs:absolute gs:top-4 gs:right-4 gs:size-6 gs:rounded">
              <X />
            </Button>
          </DialogClose>
        </DialogContent>
      </div>
    </Dialog>
  );
}

type WalletItemProps =
  | {
      wallet: AvailableWallet;
      isSelected: boolean;
      select: () => void;
      type: string;
      isAvailable: true;
      isLastConnected: boolean;
      onClick: () => void;
    }
  | {
      wallet: UnavailableWallet;
      isSelected: boolean;
      select: () => void;
      onClick?: () => void;
      type: string;
      isAvailable: false;
      isLastConnected: boolean;
    };

function WalletItem({
  wallet,
  isSelected,
  isAvailable,
  select,
  type,
  onClick,
  isLastConnected,
}: WalletItemProps) {
  const { connected } = useConnect();

  const isConnected =
    connected &&
    wallet.state === "available" &&
    connected.features[StarknetWalletApi].id ===
      wallet.wallet.features[StarknetWalletApi].id;

  return (
    <div
      title={wallet.name}
      onClick={() => {
        if (!isSelected) {
          select();
        }
        if (isAvailable) {
          onClick?.();
        }
      }}
      className={cn(
        "gs:rounded-md gs:grid gs:grid-cols-[auto_1fr] gs:gap-4 gs:p-2",
        "gs:cursor-pointer",
        isSelected
          ? "gs:bg-foreground gs:text-background"
          : "gs:hover:bg-accent gs:hover:text-accent-foreground gs:dark:hover:bg-accent/50",
      )}>
      <div className="gs:w-6 gs:h-6">
        {wallet.info?.icon ? (
          <img
            alt={wallet.name}
            className="gs:w-full gs:h-full gs:bg-contain"
            src={wallet.info.icon}
          />
        ) : (
          <span className="gs:bg-amber-300 gs:font-bold gs:text-xs gs:rounded-md gs:w-full gs:h-full gs:items-center gs:justify-center gs:flex">
            {wallet.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="gs:font-medium gs:flex gs:items-center gs:justify-between gs:min-w-0">
        <span className="gs:truncate gs:min-w-0 gs:flex-1 gs:pr-2">
          {wallet.name}
        </span>
        {isLastConnected && !isSelected && !isConnected && (
          <Badge className="gs:shrink-0">Last connected</Badge>
        )}
        {isConnected && (
          <div className="gs:shrink-0 gs:bg-green-500 gs:size-2 gs:rounded-full gs:mr-2" />
        )}
      </div>
    </div>
  );
}

function SelectedWalletUi({
  walletUi,
  handleConnect,
}: {
  walletUi?: WalletUiMap | undefined;
  handleConnect: (wallet: WalletWithStarknetFeatures) => void;
}) {
  return (
    <SelectedWallet className="gs:flex gs:flex-col gs:h-[500px] gs:overflow-y-auto gs:styled-scrollbar">
      {(wallet) => {
        if (!wallet) {
          return <DefaultPreview />;
        }

        if (wallet && wallet.state === "unavailable") {
          return <UnavailableWalletPreview wallet={wallet} />;
        }

        const walletUiData =
          walletUi?.[wallet.wallet.features[StarknetWalletApi].id];

        if (walletUiData?.viewPanel) {
          return walletUiData.viewPanel(wallet);
        }

        return (
          <AvailableWalletPreview
            wallet={wallet}
            handleConnect={handleConnect}
          />
        );
      }}
    </SelectedWallet>
  );
}

function DefaultPreview() {
  return (
    <div className="gs:flex gs:flex-col gs:justify-center gs:items-center gs:p-8 gs:py-12 gs:text-center gs:h-full">
      <div className="gs:flex gs:flex-col gs:items-center gs:justify-center">
        <TokenBrandedStarknet className="gs:size-20" />
        <p className="gs:text-lg gs:font-semibold gs:mb-2">Starknet</p>
        <p className="gs:text-sm gs:text-muted-foreground gs:font-medium gs:mb-2">
          Connect your Starknet wallet here
        </p>
        <a href="https://starknet.io" target="_blank" rel="noopener noreferrer">
          <Button>Learn more</Button>
        </a>
      </div>
    </div>
  );
}

function AvailableWalletPreview({
  wallet,
  handleConnect,
}: {
  wallet: AvailableWallet;
  handleConnect: (wallet: WalletWithStarknetFeatures) => void;
}) {
  const { isConnecting, isError, connected, connect, disconnect } =
    useConnect();

  return (
    <div className="gs:flex gs:flex-col gs:justify-center gs:items-center gs:p-8 gs:text-center gs:h-full">
      <div className="gs:flex gs:flex-col gs:items-center gs:justify-center">
        <img
          src={wallet.wallet.icon}
          alt={wallet.name}
          className="gs:w-12 gs:h-12 gs:mb-2"
        />
        <h2 className="gs:text-xl gs:font-semibold gs:mb-2">{wallet.name}</h2>
      </div>

      <div className="gs:flex gs:flex-col gs:items-center gs:justify-center gs:mt-2">
        {isConnecting && !connected && (
          <div className="gs:font-medium gs:text-muted-foreground gs:flex gs:items-center gs:gap-2">
            <Loader2 className="gs:animate-spin gs:size-4" />
            Connecting...
          </div>
        )}
        {!isConnecting && !connected && isError && (
          <div className="gs:font-medium gs:text-muted-foreground gs:flex gs:flex-col gs:items-center gs:gap-2">
            <div className="gs:flex gs:items-center gs:gap-2">
              <AlertCircle className="gs:size-4" />
              Failed to connect
            </div>
            <Button
              onClick={() => {
                handleConnect(wallet.wallet);
              }}>
              Try again
            </Button>
          </div>
        )}
        {connected ? (
          connected.features[StarknetWalletApi].id ===
          wallet.wallet.features[StarknetWalletApi].id ? (
            <div className="gs:font-medium gs:text-muted-foreground gs:flex gs:flex-col gs:items-center gs:gap-2">
              <div className="gs:flex gs:items-center gs:gap-2">
                <CheckCircle className="gs:size-4 gs:text-green-500" />
                Connected to{" "}
                <span className="gs:font-mono gs:bg-accent gs:px-1 gs:rounded-md gs:text-accent-foreground">
                  {connected.accounts?.[0]?.address.slice(0, 6)}...
                  {connected.accounts?.[0]?.address.slice(-4)}
                </span>
              </div>
            </div>
          ) : (
            <div className="gs:font-medium gs:text-muted-foreground gs:flex gs:flex-col gs:items-center gs:gap-2">
              <div className="gs:flex gs:items-center gs:justify-center gs:flex-col gs:gap-2">
                <Button
                  onClick={() => {
                    disconnect();
                    connect(wallet.wallet);
                  }}>
                  Switch to {wallet.name}
                </Button>
              </div>
            </div>
          )
        ) : !isConnecting && !isError ? (
          <div className="gs:font-medium gs:text-muted-foreground gs:flex gs:flex-col gs:items-center gs:gap-2">
            <div className="gs:flex gs:items-center gs:justify-center gs:flex-col gs:gap-2">
              <Button
                onClick={() => {
                  connect(wallet.wallet);
                }}>
                Connect to {wallet.name}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function UnavailableWalletPreview({ wallet }: { wallet: UnavailableWallet }) {
  return (
    <div className="gs:flex gs:flex-col gs:justify-center gs:items-center gs:p-8 gs:py-12 gs:text-center">
      <div className="gs:flex gs:flex-col gs:items-center gs:justify-center">
        <div className="gs:w-12 gs:h-12 gs:mb-2 gs:flex-none">
          <img
            src={wallet.info.icon}
            alt={wallet.name}
            className="gs:h-full gs:w-full gs:bg-contain gs:flex-none"
          />
        </div>
        <h2 className="gs:text-xl gs:font-semibold gs:mb-2">
          Get {wallet.name}
        </h2>
      </div>

      <div className="gs:mt-8 gs:w-full">
        <div className="gs:grid gs:grid-cols-1 gs:gap-2 gs:w-full">
          {Object.entries(wallet.info.downloads).map(([store, url]) => {
            const entry = downloadEntries[store];
            if (!entry) {
              return <Fragment key={store} />;
            }
            return (
              <div
                key={store}
                className="gs:grid gs:grid-cols-[auto_1fr] gs:gap-4 gs:bg-accent gs:p-4 gs:rounded-md">
                <div className="gs:flex gs:items-center gs:justify-center">
                  <entry.icon className="gs:h-auto gs:w-8" />
                </div>
                <div className="gs:flex gs:justify-between gs:gap-2 gs:items-center">
                  <p className="gs:font-medium">{entry.name}</p>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <Button size={"sm"} className="gs:w-36 gs:text-xs">
                      {entry.button}
                    </Button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type DownloadEntry = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
  button: string;
};

const downloadEntries: Record<string, DownloadEntry> = {
  chrome: {
    icon: LogosChrome,
    name: "Chrome",
    button: "Add to Chrome",
  },
  firefox: {
    icon: LogosFirefox,
    name: "Firefox",
    button: "Add to Firefox",
  },
  edge: {
    icon: LogosMicrosoftEdge,
    name: "Edge",
    button: "Add to Edge",
  },
  safari: {
    icon: LogosSafari,
    name: "Safari",
    button: "Add to Safari",
  },
  android: {
    icon: LogosAndroidIcon,
    name: "Android",
    button: "Get the app",
  },
  ios: {
    icon: LogosApple,
    name: "iOS",
    button: "Get the app",
  },
};
