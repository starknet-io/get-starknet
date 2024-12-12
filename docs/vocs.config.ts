import { defineConfig } from "vocs";
import tsConfigPaths from "vite-tsconfig-paths";

import { sidebar } from "./sidebar";

export default defineConfig({
  title: "Get Starknet",
  rootDir: ".",
  sidebar,
  topNav: [
    { text: "Docs", link: "/docs/", match: "/docs" },
    { text: "Demos", link: "/demos", match: "/demos" },
  ],
  vite: {
    plugins: [tsConfigPaths()],
  },
});
