const path = require("path");

module.exports = (env, argv) => {
    return {
        entry: "./src/index.ts",
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
        optimization: {
            minimize: false,
        },
        output: {
            filename: "index.js",
            chunkFormat: "commonjs",
            path: path.resolve(__dirname, "dist"),
            clean: true,
        },
    };
};
