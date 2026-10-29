import { defineConfig } from "vocs/config";

import { sidebar } from "./sidebar";

export default defineConfig({
  title: "Get Starknet",
  rootDir: ".",
  srcDir: ".",
  renderStrategy: "full-static",
  sidebar,
  topNav: [
    {
      text: "Guide",
      link: "/",
    },
    {
      text: "UI",
      link: "/ui",
    },
    {
      text: "Headless UI",
      link: "/modal",
    },
    {
      text: "Core",
      link: "/core",
    },
  ],
});
