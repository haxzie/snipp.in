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
          "!accessibilityHelp",
          "anchorSelect",
          "bracketMatching",
          "caretOperations",
          "clipboard",
          "!codeAction",
          "!codelens",
          "colorPicker",
          "!comment",
          "!contextmenu",
          "!coreCommands",
          "cursorUndo",
          "dnd",
          "documentSymbols",
          "!find",
          "folding",
          "fontZoom",
          "format",
          "!gotoError",
          "!gotoLine",
          "!gotoSymbol",
          "hover",
          "!iPadShowKeyboard",
          "!inPlaceReplace",
          "indentation",
          "inlineHints",
          "inspectTokens",
          "linesOperations",
          "linkedEditing",
          "links",
          "multicursor",
          "parameterHints",
          "!quickCommand",
          "!quickHelp",
          "!quickOutline",
          "!referenceSearch",
          "!rename",
          "!smartSelect",
          "!snippets",
          "!suggest",
          "!toggleHighContrast",
          "!toggleTabFocusMode",
          "!transpose",
          "!unusualLineTerminators",
          "!viewportSemanticTokens",
          "wordHighlighter",
          "!wordOperations",
          "!wordPartOperations",
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
  },
  devServer: {
    watchOptions: {
      poll: true,
    },
  },
};
