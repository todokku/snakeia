const path = require("path");

const config = [
{
  entry: "./src/index.js",
  mode: "production",
  performance: { hints: false },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "SnakeIA.js",
    library: "SnakeIA",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|libs)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"]
          }
        }
      }
    ]
  }
},
{
  entry: "./src/gameEngineWorker.js",
  mode: "production",
  performance: { hints: false },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "GameEngineWorker.js"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|libs)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"]
          }
        }
      }
    ]
  }
}];

module.exports = config;