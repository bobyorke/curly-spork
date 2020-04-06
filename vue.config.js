module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      '^/scoresApi': {
        target: 'http://localhost:8081',
      },
    }
  },
};
