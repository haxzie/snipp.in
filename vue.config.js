module.exports = {
  chainWebpack: (config) => {
    config.module.rules.delete("eslint");
  },
  configureWebpack: {
    // plugins: [new BundleAnalyzerPlugin()],
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
