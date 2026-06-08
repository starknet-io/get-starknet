import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/chains.ts", "src/features.ts"],
  outDir: "./dist",
  clean: true,
  dts: true,
  sourcemap: true,
  hash: false,
  format: ["esm", "cjs"],
});
