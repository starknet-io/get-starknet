import { defineConfig } from "vocs";
import tsConfigPaths from "vite-tsconfig-paths";

import { sidebar } from "./sidebar";

export default defineConfig({
  title: "Get Starknet",
  rootDir: ".",
  sidebar,
  vite: {
    plugins: [tsConfigPaths()],
  },
});
