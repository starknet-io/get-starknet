import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vocs";

import { sidebar } from "./sidebar";

export default defineConfig({
  title: "Get Starknet",
  rootDir: ".",
  sidebar,
  vite: {
    plugins: [tailwindcss()],
  },
});
