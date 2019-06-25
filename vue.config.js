var webpack = require('webpack');

module.exports = {
  // proxy all webpack dev-server requests starting with /api
  // to our Spring Boot backend (localhost:8088) using http-proxy-middleware
  // see https://cli.vuejs.org/config/#devserver-proxy
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8050',
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.EnvironmentPlugin({
        CLIENT_ID: '0oan3vml3k4TQUvJz356',
        REDIRECT_URI: 'http://localhost:8080/implicit/callback'
      }),
    ]
  }
}