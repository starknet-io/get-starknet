# get-starknet<br/>StarkNet wallet <-> dApp bridge

[![npm](https://img.shields.io/npm/v/get-starknet.svg)](https://www.npmjs.com/package/get-starknet)

## Alpha version

## Goals

- Allow dApps to seamlessly connect to any wallet on StarkNet
- Allow wallets to seamlessly connect to any dApp, and get discovered by users which need a new wallet
- An open source wallet/dApp API controlled by the community
- An open source StarkNet wallet discovery list moderated by the community

## Installation
```
# using npm
npm install get-starknet

# using yarn
yarn add get-starknet
```

## Usage for dApp developers

If you were using getStarknet() before, simply replace the import line as below.

```diff
-import { getStarknet } from "@argent/get-starknet"
+import { getStarknet } from "get-starknet"
```

- Optional - customize the CSS of get-starknet to match your look&amp;feel
- Optional - integrate with new API functions (e.g.: modify wallet list using custom sort/include/exclude, etc.)

## Details

### Flow

- Once a dApp wants to connect to a wallet, it calls `getStarknet()` (or optionally use the new `connect` API to control the order, included/excluded, etc.)

- In the first call to `getStarknet()` the package will look for all injected extensions in the window which were added using a key starting with `starknet-*`, i.e. `starknet-walletname`


- There are three cases

  - No objects found: meaning there is no installed wallet extension. In this case, a popup is shown (possibly customizable by the dApp) with a few ordering options of the known wallets with install links -
     - dApp controlled order
     - Community controlled order
     - Random
     - Also allowed including/excluding wallets from the list
  - A single object is found: this object is returned as the Starknet window object. dApp will use the returned (installed) wallet for this session
  - Multiple objects are found: In this case a popup is shown to the user (again, possibly customizable) with a random order of the available wallet objects. Users can select the wallet they want to use, possibly selecting the default wallet for this dApp.
    - If there is one or more pre-authorized wallets, show them first in the list ordered by last selected (from connect-to-wallet popup, saved in localStorage by the lib)
    - Multiple objects are found AND a default wallet was selected for this dApp (based on localstorage): the default wallet is selected

### Wallet Developers

- Create a wallet complying to the required APIs (based on the starknet.js APIs + 3 new fields: `name`, `icon` and `id`, for the &quot;choose a wallet&quot; popup (e.g. installed wallets list))
- The wallet's page-script object should be added to `window` using a key starting with `starknet`, i.e. `starknet-walletname`
- Optional - for the wallet to be included in the discovery list - the wallet developer will issue a pull request to `get-starknet`, comprising of the following:
  - Name and icon
  - Formalized links object with links to to download page over chrome, firefox and other extension stores


### Package maintainers

- Implement the code
- Provide CSS classes for easy customization of popups (wallet discovery and wallet selection)
- Accept pull requests for new wallets into the discovery popup, after some validation of the wallet functionality (in the future we can enable wallet list management on-chain with a governance mechanism for adding new wallets using the StarkNet token / governance mechanism).
