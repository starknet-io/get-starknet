import type { Sidebar } from "vocs";

const PACKAGES = [
  "core",
  "ui",
  "modal",
  "discovery",
  "virtual-wallet",
  "wallet-standard",
  "wallets",
];

export const sidebar = [
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
    text: "API Reference",
    collapsed: false,
    items: PACKAGES.map((pkg) => ({
      text: pkg,
      link: `/api/${pkg}`,
    })),
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
] satisfies Sidebar;
