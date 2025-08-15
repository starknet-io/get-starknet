import type { Sidebar } from "vocs";

export const sidebar = {
  "/": [
    {
      text: "Introduction",
      link: "/",
    },
    {
      text: "Getting Started",
      link: "/getting-started",
    },
    {
      text: "Wallet Standard",
      link: "/wallet-standard",
    },
    {
      text: "Customization",
      link: "/customization",
    },
    {
      text: "Wallet Integration",
      link: "/integration-guide",
    },
    {
      text: "Demo",
      items: [
        {
          text: "Wallet Modal",
          link: "/demo/ui",
        },
        {
          text: "Headless Modal",
          link: "/demo/headless-modal",
        },
        {
          text: "Discovery",
          link: "/demo/discovery",
        },
      ],
    },
  ],
  "/core": [
    {
      text: "Overview",
      link: "/core",
    },
    {
      text: "Reference",
      items: [
        {
          text: "createStore",
          link: "/core/createStore",
        },
        {
          text: "StarknetWalletRequestFeature",
          link: "/core/StarknetWalletRequestFeature",
        },
        {
          text: "wallets",
          link: "/core/wallets",
        },
        {
          text: "StarknetInjectedWallet",
          link: "/core/StarknetInjectedWallet",
        },
        {
          text: "isStarknetChain",
          link: "/core/isStarknetChain",
        },
        {
          text: "formatStarknetChainId",
          link: "/core/formatStarknetChainId",
        },
        {
          text: "getStarknetChainId",
          link: "/core/getStarknetChainId",
        },
        {
          text: "EIP1193Adapter",
          link: "/core/EIP1193Adapter",
        },
        {
          text: "metaMaskVirtualWallet",
          link: "/core/metaMaskVirtualWallet",
        },
      ],
    },
  ],
} satisfies Sidebar;
