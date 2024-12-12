import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import { createStore } from "@get-starknet/discovery";
import type { WalletWithStarknetFeatures } from "@get-starknet/wallet-standard/features";

const store = createStore();
const queryClient = new QueryClient();

export default function WalletDiscoveryDemo() {
  const wallets = store.getWallets();
  // const wallets = useSyncExternalStore(store.subscribe, store.getWallets, store.getWallets);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="border border-gray-200 rounded-md p-4">
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
            <WalletInfo key={wallet.name} wallet={wallet} />
          ))}
        </div>
      </div>
    </QueryClientProvider>
  );
}

function WalletInfo({ wallet }: { wallet: WalletWithStarknetFeatures }) {
  const { data } = useQuery({
    queryKey: ["wallet", wallet.name],
    queryFn: () =>
      wallet.features["starknet:walletRequest"].request({
        type: "wallet_getPermissions",
      }),
  });

  return (
    <div className="border border-gray-200 p-2 rounded-md flex flex-col gap-1">
      <p className="text-md">{wallet.name}</p>
      <p className="text-sm text-gray-500">{JSON.stringify(data)}</p>
    </div>
  );
}
