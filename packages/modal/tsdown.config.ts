import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "./dist",
  clean: true,
  dts: true,
  sourcemap: true,
  hash: false,
  format: ["esm", "cjs"],
  inputOptions: {
    external: ["react", "react-dom"],
    transform: {
      jsx: "react-jsx",
    },
  },
});
