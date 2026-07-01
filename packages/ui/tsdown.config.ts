import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { defineConfig } from "tsdown";

const execAsync = promisify(exec);

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "./dist",
  sourcemap: true,
  dts: true,
  clean: true,
  hash: false,
  format: ["esm", "cjs"],
  alias: {
    src: fileURLToPath(new URL("src", import.meta.url)),
  },
  inputOptions: {
    external: ["react", "react-dom", /\.css$/],
    transform: {
      jsx: "react-jsx",
    },
  },
  hooks: {
    "build:done": async (ctx) => {
      await execAsync("tailwindcss -i ./src/styles.css -o ./dist/styles.css");
    },
  },
});
