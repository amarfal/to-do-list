import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(process.cwd(), "dist"),
    clean: true
  },
  devtool: "source-map",
  devServer: { static: "./dist", port: 8080 },
  module: {
    rules: [
      { test: /\.css$/i, use: ["style-loader", "css-loader"] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      inject: "body"
    })
  ]
};