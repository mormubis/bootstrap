const path = require('path');
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');

const common = require('./webpack.common');

module.exports = {
  ...common,
  devServer: {
    compress: true,
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: {
      rewrites: [{ from: /\/static/, to: '/index.html' }],
    },
    hot: true,
    overlay: true,
    port: 8080,
  },
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',
  plugins: [
    ...common.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new WriteFilePlugin(),
  ],
};
