import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import del from "rollup-plugin-delete";

const isDev = process.env.ROLLUP_WATCH;

export default {
    input: "src/index.ts",
    output: [
        {
            format: "cjs",
            dir: "dist/",
            sourcemap: true,
        },
    ],
    external: ["starknet"],
    plugins: [
        del({ targets: "dist/*" }),

        svelte({
            preprocess: sveltePreprocess(),
            emitCss: false,
            compilerOptions: {
                dev: isDev,
            },
        }),

        resolve({
            browser: true,
            dedupe: ["svelte"],
            preferBuiltins: true,
        }),

        commonjs(),

        typescript(),

        !isDev &&
            terser({
                compress: {
                    drop_console: true,
                },
            }),
    ],
};
