import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
  input: "./src/index.ts",
  output: [
    {
      format: "esm",
      dir: "./dist",
      sourcemap: true,
      entryFileNames: "[name].mjs",
    },
  ],
  jsx: {
    mode: "automatic",
  },
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
      declaration: true,
      declarationDir: "./dist",
    }),
  ],
});
