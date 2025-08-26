import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vocs";

import { sidebar } from "./sidebar";

export default defineConfig({
  title: "Get Starknet",
  rootDir: ".",
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
  vite: {
    plugins: [tailwindcss()],
  },
});
