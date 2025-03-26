import { createStore } from "@starknet-io/get-starknet-discovery";
import type { StarknetWalletAccount } from "@starknet-io/get-starknet-wallet-standard";
import type { WalletWithStarknetFeatures } from "@starknet-io/get-starknet-wallet-standard/features";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import type { StandardEventsChangeProperties } from "@wallet-standard/features";
import { RefreshCcw, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const store = createStore();
const queryClient = new QueryClient();

function useWallets(): readonly WalletWithStarknetFeatures[] {
  const [wallets, setWallets] = useState<readonly WalletWithStarknetFeatures[]>(
    [],
  );

  useEffect(() => {
    setWallets(store.getWallets());

    return store.subscribe((wallets) => setWallets(wallets));
  }, []);

  return wallets;
}

export default function WalletDiscoveryDemo() {
  const wallets = useWallets();

  const [events, setEvents] = useState<string[]>([]);

  const addEvent = useCallback((change: StandardEventsChangeProperties) => {
    const output = [];

    if (change.accounts) {
      output.push(
        `Accounts: ${change.accounts.map(formatWalletAccount).join(", ")}`,
      );
    }
    if (change.chains) {
      output.push(`Chains: ${change.chains.join(", ")}`);
    }
    const outputString = output.join(" | ");
    setEvents((prev) => [outputString, ...prev].slice(0, 10));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="border border-gray-200 rounded-md p-4 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-bold">Wallets</h1>
            <button
              className="border active:bg-gray-200/10 px-2 py-1 rounded-md"
              type="button"
              onClick={() => store._refreshInjectedWallets()}>
              <RefreshCcw />
            </button>
          </div>
          <div className="flex flex-col gap-2 pt-4">
            {wallets.map((wallet) => (
              <WalletInfo
                key={wallet.name}
                wallet={wallet}
                addEvent={addEvent}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-bold">Events</h1>
            <button
              className="border active:bg-gray-200/10 px-2 py-1 rounded-md"
              type="button"
              onClick={() => setEvents([])}>
              <Trash />
            </button>
          </div>
          <div className="flex flex-col gap-2 pt-4">
            {events.map((event, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: it's fine
              <p key={index} className="text-sm text-gray-500">
                {event}
              </p>
            ))}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

function WalletInfo({
  wallet,
  addEvent,
}: {
  wallet: WalletWithStarknetFeatures;
  addEvent: (change: StandardEventsChangeProperties) => void;
}) {
  const { data } = useQuery({
    queryKey: ["wallet", wallet.name],
    queryFn: () =>
      wallet.features["starknet:walletApi"].request({
        type: "wallet_getPermissions",
      }),
  });

  const { mutate: connect } = useMutation({
    mutationKey: ["wallet", wallet.name, "connect"],
    mutationFn: () =>
      wallet.features["standard:connect"].connect({ silent: false }),
  });

  const { mutate: connectSilent } = useMutation({
    mutationKey: ["wallet", wallet.name, "connectSilent"],
    mutationFn: () =>
      wallet.features["standard:connect"].connect({ silent: true }),
  });

  const { mutate: disconnect } = useMutation({
    mutationKey: ["wallet", wallet.name, "disconnect"],
    mutationFn: () => wallet.features["standard:disconnect"].disconnect(),
  });

  useEffect(() => {
    return wallet.features["standard:events"].on("change", addEvent);
  }, [wallet, addEvent]);

  const accounts =
    wallet.accounts.length > 0
      ? wallet.accounts.map(formatWalletAccount).join(", ")
      : "Not connected";

  return (
    <div className="border border-gray-200 p-2 rounded-md flex flex-col gap-1">
      <div className="flex flex-row justify-between">
        <p className="text-md">{wallet.name}</p>
        <p className="text-sm text-gray-500">{JSON.stringify(data)}</p>
      </div>
      <div className="flex flex-row justify-between">
        <p className="text-sm text-gray-500">
          Accounts: <span className="font-bold">{accounts}</span>
        </p>
      </div>
      <div className="flex flex-row gap-4 justify-between">
        <button
          className="border active:bg-gray-200/10 w-full px-2 py-1 rounded-md"
          type="button"
          onClick={() => connect()}>
          Connect
        </button>
        <button
          className="border active:bg-gray-200/10 w-full px-2 py-1 rounded-md"
          type="button"
          onClick={() => connectSilent()}>
          Connect Silent
        </button>
        <button
          className="border active:bg-gray-200/10 w-full px-2 py-1 rounded-md"
          type="button"
          onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    </div>
  );
}

function formatWalletAccount({
  address,
  chains,
}: StarknetWalletAccount): string {
  return `${address.slice(0, 6)}...${address.slice(-4)} on ${chains.join(", ")}`;
}
