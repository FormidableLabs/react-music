const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    './demo/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'demo'),
      ],
    }, {
      test: /\.css$/,
      include: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'demo'),
      ],
      loader: 'style!css!postcss',
    }, {
      test: /\.json$/,
      loaders: ['json'],
      include: path.join(__dirname, 'demo'),
    }],
  },
};
