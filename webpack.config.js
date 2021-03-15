const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./src/index.ts",
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.browser.json",
        },
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};
