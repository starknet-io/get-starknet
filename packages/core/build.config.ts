import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index.ts", "src/wallets.ts", "src/virtual-wallet.ts"],
  clean: true,
  outDir: "./dist",
  declaration: true,
  sourcemap: true,
  rollup: {
    emitCJS: true,
  },
});
