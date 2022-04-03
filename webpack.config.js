const path = require("path");

module.exports = (env, argv) => {
    const isDev = argv.mode === "development";

    return {
        entry: "./src/index.ts",
        stats: {
            all: isDev,
            errors: true,
        },
        devtool: "inline-source-map",
        externals: ["starknet"],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".js"],
        },
        output: {
            filename: "index.js",
            chunkFormat: "commonjs",
            path: path.resolve(__dirname, "dist"),
            clean: true,
        },
    };
};
