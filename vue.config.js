const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  chainWebpack: (config) => {
    config.module.rules.delete("eslint");
  },
  configureWebpack: {
    // plugins: [new BundleAnalyzerPlugin()],
    plugins: [
      new MonacoWebpackPlugin({
        // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        languages: ["typescript", "javascript", "css", "html", "json", "python", "markdown"],
        features: ['!gotoSymbol'],
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
