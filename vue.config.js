const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");

module.exports = {
  assetsDir: "static",
  productionSourceMap: false,
  configureWebpack: {
    plugins: [new AntdDayjsWebpackPlugin()]
  }
};
