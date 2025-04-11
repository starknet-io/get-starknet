import { Permission, type StarknetWindowObject } from "@starknet-io/types-js";

export const UnknownWalletAMock: StarknetWindowObject = {
  id: "wallet_a",
  name: "Wallet A",
  version: "0.0.0",
  icon: "https://avatars.dicebear.com/api/initials/Wallet%20A.svg",
  request: async () => false,
  on: () => {},
  off: () => {},
};

export const UnknownWalletBMock: StarknetWindowObject = {
  id: "wallet_b",
  name: "Wallet B",
  version: "0.0.0",
  icon: "https://avatars.dicebear.com/api/initials/Wallet%20B.svg",
  request: async () => false,
  on: () => {},
  off: () => {},
};

export function makeAuthorized(authorized: boolean) {
  return (wallet: StarknetWindowObject) =>
    ({
      ...wallet,
      request: async (request) => {
        switch (request.type) {
          case "wallet_getPermissions":
            return authorized ? [Permission.ACCOUNTS] : [];
          default:
            return wallet.request(request);
        }
      },
    }) as StarknetWindowObject;
}

export function makeConnected(isConnected: boolean) {
  return (wallet: StarknetWindowObject) => {
    return {
      ...makeAuthorized(true)(wallet),
      request: async ({ type }) => {
        switch (type) {
          case "wallet_getPermissions":
            return isConnected ? [Permission.ACCOUNTS] : [];
          default:
            return [];
        }
      },
    } as StarknetWindowObject;
  };
}
