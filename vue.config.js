const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
module.exports = {
  chainWebpack: (config) => {
    config.module.rules.delete("eslint");
  },
  configureWebpack: {
    // plugins: [new BundleAnalyzerPlugin()],
    plugins: [
      // new BundleAnalyzerPlugin(),
      new MonacoWebpackPlugin({
        // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        languages: [
          "typescript",
          "javascript",
          "css",
          "html",
          "json",
          "python",
          "markdown",
          "sql",
          "shell",
        ],
        features: [
          "anchorSelect",
          "bracketMatching",
          "caretOperations",
          "clipboard",
          "colorPicker",
          "cursorUndo",
          "dnd",
          "documentSymbols",
          "folding",
          "fontZoom",
          "format",
          "hover",
          "indentation",
          "inlineHints",
          "inspectTokens",
          "linesOperations",
          "linkedEditing",
          "links",
          "multicursor",
          "wordHighlighter",
        ],
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        //   data: `
        //     @import "@/styles/setup/_mixins.scss";
        //   `
      },
    },
  }
};
