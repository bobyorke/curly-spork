module.exports = {
  publicPath: '/scores/',
  devServer: {
    disableHostCheck: true,
    proxy: {
      '^/scoresApi': {
        target: 'http://localhost:8081',
      },
    }
  },
};
