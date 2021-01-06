const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");

module.exports = {
  assetsDir: "static",
  productionSourceMap: false,
  configureWebpack: {
    plugins: [new AntdDayjsWebpackPlugin()]
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3333',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/qq-stream': {
        target: 'http://isure.stream.qqmusic.qq.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/qq-stream': ''
        }
      }
    }
  }
};
