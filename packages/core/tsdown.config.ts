import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/wallets.ts", "src/virtual-wallet.ts"],
  outDir: "./dist",
  sourcemap: true,
  dts: true,
  clean: true,
  hash: false,
  format: ["esm", "cjs"],
});
