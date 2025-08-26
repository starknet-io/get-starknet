import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { defineBuildConfig } from "unbuild";

const execAsync = promisify(exec);

export default defineBuildConfig({
  entries: ["src/index.ts"],
  alias: {
    "~ui": fileURLToPath(new URL("src", import.meta.url)),
  },
  outDir: "dist",
  clean: true,
  declaration: true,
  externals: ["react", "react-dom", /\.css$/],
  rollup: {
    esbuild: {
      jsx: "automatic",
    },
  },
  sourcemap: true,
  hooks: {
    "build:done": async (ctx) => {
      await execAsync("tailwindcss -i ./src/styles.css -o ./dist/styles.css");
    },
  },
});
