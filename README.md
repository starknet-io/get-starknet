# get-starknet

[![npm](https://img.shields.io/npm/v/%40starknet-io%2Fget-starknet)](https://www.npmjs.com/package/@starknet-io/get-starknet)

## Goals

- ❤️‍🩹 Allow Starknet dApps and wallets to seamlessly connect
- 🪶 Lightweight and easy to use
- 🏎 Fast integration, building and testing
- ⚙️ Customizable and extensible
- 🌍 Open source and controlled by the community

## Installation

```
# using npm
npm install @starknet-io/get-starknet starknet

# using yarn
yarn add @starknet-io/get-starknet starknet

# using pnpm
pnpm add @starknet-io/get-starknet starknet
```

Read more about the new Starkent Dapp<>Wallet API in the
[post](https://community.starknet.io/t/new-starknet-wallet-dapp-api/114295)

## Usage for dApp developers

You can use the built-in UI to connect to any Starknet wallet as fast as
possible like this:

```tsx
import { connect, disconnect } from "@starknet-io/get-starknet"

return <button onClick={() => connect()}>Connect wallet</button>
```

### Advanced usage

You can also choose to customize the UI by overwriting the CSS classes, or by
implementing your very own UI. This is possible due to a split into a `core` and
`ui` package. As a library author or dapp developer who wants to implement a
custom UI, you can use the `core` package.

```tsx
import { getStarknet } from "@starknet-io/get-starknet-core"

// `@starknet-io/get-starknet-core` exports the `getStarknet()` factory (and a
// default, ready-to-use instance). The methods below live on the object it
// returns, they are not named exports of the package:
const {
  getAvailableWallets,
  getAuthorizedWallets,
  getDiscoveryWallets,
  getLastConnectedWallet,
  discoverVirtualWallets,
  enable,
  disconnect,
} = getStarknet()

// The returned object implements GetStarknetResult:
interface GetStarknetResult {
  // Returns all wallets available in the window object
  getAvailableWallets: (
    options?: GetWalletOptions,
  ) => Promise<StarknetWindowObject[]>
  // Returns only preauthorized wallets available in the window object
  getAuthorizedWallets: (
    options?: GetWalletOptions,
  ) => Promise<StarknetWindowObject[]>
  // Returns all wallets in existence (from discovery file)
  getDiscoveryWallets: (options?: GetWalletOptions) => Promise<WalletProvider[]>
  // Returns the last wallet connected when it's still connected
  getLastConnectedWallet: () => Promise<StarknetWindowObject | null | undefined>
  // Discovers the virtual wallets by calling their hasSupport methods
  discoverVirtualWallets: () => Promise<void>
  // Connects to a wallet
  enable: (
    wallet: StarknetWindowObject | VirtualWallet,
    options?: RequestAccountsParameters,
  ) => Promise<StarknetWindowObject>
  // Disconnects from a wallet
  disconnect: (options?: DisconnectOptions) => Promise<void>
}
```

## Development

You need Node and pnpm installed. Make sure to clone this repo and run:

```bash
pnpm install
pnpm build
```

To start watching for changes, run:

```bash
pnpm dev
```

and open `http://localhost:5173/`

### Running tests

For running tests:

```bash
pnpm test
```
