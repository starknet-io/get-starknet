"use client";

import {
  type AvailableWallet,
  GetStarknetProvider,
  SelectedWallet,
  type UnavailableWallet,
  type UseConnect,
  WalletList,
  useConnect,
} from "@starknet-io/get-starknet-modal";
import { useMemo, useState } from "react";
import { WebWallet } from "./web-wallet";

export default function WalletModalDemo() {
  const webWallet = useMemo(() => new WebWallet(), []);

  return (
    <GetStarknetProvider extraWallets={[webWallet]}>
      <WalletUser />
    </GetStarknetProvider>
  );
}

type ConnectWalletMethod = UseConnect["connect"];

function WalletUser() {
  const [sortMethod, setSortMethod] = useState<
    "alpha-asc" | "alpha-desc" | "random"
  >("alpha-asc");
  const { connected, connect, disconnect } = useConnect();

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-row gap-2 justify-between">
        <div className="flex flex-row gap-2 justify-start">
          <p className="font-bold">Sort by:</p>
          <button
            type="button"
            onClick={() => setSortMethod("alpha-asc")}
            className={sortMethod === "alpha-asc" ? "underline" : ""}>
            Alpha A-Z
          </button>
          <button
            type="button"
            onClick={() => setSortMethod("alpha-desc")}
            className={sortMethod === "alpha-desc" ? "underline" : ""}>
            Alpha Z-A
          </button>
          <button
            type="button"
            onClick={() => setSortMethod("random")}
            className={sortMethod === "random" ? "underline" : ""}>
            Random
          </button>
        </div>
        <div className="flex flex-row gap-2">
          <p
            className={`font-bold ${connected?.name ? "text-green-500" : "text-red-500"}`}>
            {connected?.name ? "Connected" : "Not connected"}
          </p>
          {connected?.name && (
            <button
              type="button"
              className="!bg-red-500 text-xs !text-white px-2 py-1 rounded-md"
              onClick={disconnect}>
              Disconnect
            </button>
          )}
        </div>
      </div>

      <WalletList
        sortAlgorithm={sortMethod}
        className="flex flex-col gap-2 border border-gray-300 p-4 rounded-md">
        {({ isSelected, select, type, ...wallet }) =>
          wallet.state === "available" ? (
            <AvailableWalletButton
              key={wallet.name}
              wallet={wallet}
              isSelected={isSelected}
              select={select}
              connect={connect}
              type={type}
            />
          ) : (
            <UnavailableWalletButton
              key={wallet.name}
              wallet={wallet}
              isSelected={isSelected}
              select={select}
              type={type}
            />
          )
        }
      </WalletList>
      <SelectedWallet className="w-full border border-gray-300 p-4 rounded-md">
        {(wallet) =>
          wallet ? (
            wallet.state === "available" ? (
              <AvailableWalletScreen key={wallet.name} wallet={wallet} />
            ) : (
              <UnavailableWalletScreen key={wallet.name} wallet={wallet} />
            )
          ) : (
            <div>No wallet selected</div>
          )
        }
      </SelectedWallet>
    </div>
  );
}

function AvailableWalletButton({
  wallet,
  isSelected,
  select,
  connect,
  type,
}: {
  wallet: AvailableWallet;
  isSelected: boolean;
  select: () => void;
  connect: ConnectWalletMethod;
  type: string;
}): React.ReactNode {
  return (
    <WalletButton
      name={wallet.name}
      icon={wallet.info?.icon}
      isInstalled={true}
      isSelected={isSelected}
      select={select}
      type={type}
      onClick={() => connect(wallet.wallet)}
    />
  );
}

function UnavailableWalletButton({
  wallet,
  isSelected,
  select,
  type,
}: {
  wallet: UnavailableWallet;
  isSelected: boolean;
  select: () => void;
  type: string;
}): React.ReactNode {
  return (
    <WalletButton
      name={wallet.name}
      icon={wallet.info?.icon}
      isInstalled={false}
      isSelected={isSelected}
      select={select}
      type={type}
    />
  );
}

function WalletButton({
  icon,
  name,
  isInstalled,
  isSelected,
  select,
  onClick,
  type,
}: {
  icon?: string;
  name: string;
  isInstalled: boolean;
  isSelected: boolean;
  select: () => void;
  onClick?: () => void;
  type: string;
}) {
  const click = () => {
    select();
    onClick?.();
  };

  return (
    <button
      onClick={() => click()}
      type="button"
      className={`flex flex-row p-4 gap-2 items-center justify-between hover:bg-gray-100/10 cursor-pointer border rounded-md${
        isSelected ? " border-textAccent" : " border-transparent"
      }`}>
      <p className="w-full flex flex-row items-center gap-2">
        {icon ? (
          <img alt={name} className="w-6 h-6" src={icon} />
        ) : (
          <span className="w-6 h-6 bg-amber-300 rounded-full flex items-center justify-center flex-shrink-0">
            {name.charAt(0)}
          </span>
        )}
        {name}
      </p>
      {isInstalled ? (
        <p className="text-xs bg-infoBackground border rounded-md border-infoBorder px-2 py-1">
          Installed
        </p>
      ) : (
        <p />
      )}
      {type !== "unknown" && (
        <p className="text-xs bg-infoBackground border rounded-md border-infoBorder px-2 py-1">
          {type}
        </p>
      )}
    </button>
  );
}

function AvailableWalletScreen({
  wallet,
}: {
  wallet: AvailableWallet;
}): React.ReactNode {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold">{wallet.name}</p>
      <p className="text-sm text-gray-500">
        Connected Address:{" "}
        {wallet.wallet.accounts?.[0]?.address
          ? wallet.wallet.accounts?.[0]?.address
          : "No address connected"}
      </p>
    </div>
  );
}

function UnavailableWalletScreen({
  wallet,
}: {
  wallet: UnavailableWallet;
}): React.ReactNode {
  return (
    <div className="flex flex-col items-center gap-4">
      <img
        alt={wallet.name}
        className="w-24 h-24"
        src={wallet.info?.icon ?? ""}
      />
      <p className="text-xl font-bold">{wallet.name}</p>
      <ul className="flex flex-row gap-2">
        {Object.entries(wallet.info?.downloads ?? {}).map(([key, value]) => (
          <li key={key} className="min-w-[100px] text-center">
            <a href={value} target="_blank" rel="noreferrer">
              {key}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
