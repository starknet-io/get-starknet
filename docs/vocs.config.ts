import { defineConfig } from "vocs/config";

import { sidebar } from "./sidebar";

export default defineConfig({
  title: "Get Starknet",
  // `/get-starknet` when deployed to GitHub Pages (see `.github/workflows/docs.yml`).
  basePath: process.env.DOCS_BASE_PATH,
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
