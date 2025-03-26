"use client";

import {
  type AvailableWallet,
  GetStarknetProvider,
  SelectedWallet,
  type UnavailableWallet,
  WalletList,
  useConnect,
} from "@starknet-io/get-starknet-modal";
import { useState } from "react";

export default function WalletModalDemo() {
  return (
    <GetStarknetProvider>
      <WalletUser />
    </GetStarknetProvider>
  );
}

function WalletUser() {
  const [sortMethod, setSortMethod] = useState<
    "alpha-asc" | "alpha-desc" | "random"
  >("alpha-asc");
  const { connected } = useConnect();

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-row gap-2 justify-between">
        <div className="flex flex-row gap-2 justify-start">
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
        <p>{connected ? "YES" : "NO"}</p>
      </div>

      <WalletList
        sortAlgorithm={sortMethod}
        className="flex flex-col gap-2 border border-gray-300 p-4">
        {({ isSelected, select, ...wallet }) =>
          wallet.state === "available" ? (
            <AvailableWalletButton
              key={wallet.name}
              wallet={wallet}
              isSelected={isSelected}
              select={select}
            />
          ) : (
            <UnavailableWalletButton
              key={wallet.name}
              wallet={wallet}
              isSelected={isSelected}
              select={select}
            />
          )
        }
      </WalletList>
      <SelectedWallet className="w-full border border-gray-300 p-4">
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
}: {
  wallet: AvailableWallet;
  isSelected: boolean;
  select: () => void;
}): React.ReactNode {
  const { connect } = useConnect();
  return (
    <WalletButton
      name={wallet.name}
      icon={wallet.info?.icon}
      isInstalled={true}
      isSelected={isSelected}
      select={select}
      onClick={() => connect(wallet.wallet)}
    />
  );
}

function UnavailableWalletButton({
  wallet,
  isSelected,
  select,
}: {
  wallet: UnavailableWallet;
  isSelected: boolean;
  select: () => void;
}): React.ReactNode {
  return (
    <WalletButton
      name={wallet.name}
      icon={wallet.info?.icon}
      isInstalled={false}
      isSelected={isSelected}
      select={select}
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
}: {
  icon?: string;
  name: string;
  isInstalled: boolean;
  isSelected: boolean;
  select: () => void;
  onClick?: () => void;
}) {
  const click = () => {
    select();
    onClick?.();
  };

  return (
    <button
      onClick={() => click()}
      type="button"
      className={`flex flex-row p-4 gap-2 items-center justify-between hover:bg-gray-100/10 cursor-pointer border${
        isSelected ? " border-red-500" : " border-transparent"
      }`}>
      <p className="w-full flex flex-row items-center gap-2">
        <img alt={name} className="w-6 h-6" src={icon ?? ""} />
        {name}
      </p>
      {isInstalled ? (
        <p className="text-xs bg-gray-800 px-2 py-1">Installed</p>
      ) : (
        <p />
      )}
    </button>
  );
}

function AvailableWalletScreen({
  wallet,
}: {
  wallet: AvailableWallet;
}): React.ReactNode {
  return <div>Hello</div>;
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
