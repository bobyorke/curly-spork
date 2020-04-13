module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      '^/scoresApi': {
        target: 'http://3.10.198.249:8081',
      },
    },
  },
};
