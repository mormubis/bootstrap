const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

function simple(str) {
  let hash = 0;

  if (str.length === 0) {
    return hash;
  }

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + char;
    // eslint-disable-next-line no-bitwise
    hash &= hash; // Convert to 32bit integer
  }

  return hash;
}

const SRC = path.resolve(__dirname, 'src');

module.exports = {
  entry: ['react-hot-loader/patch', './src'],
  module: {
    rules: [
      {
        exclude: [path.resolve(__dirname, 'node_modules/')],
        test: /\.js$/,
        use: ['babel-loader'],
      },
      {
        include: /node_modules/,
        test: /\.(js|jsx)$/,
        use: 'react-hot-loader/webpack',
      },
      {
        test: /\.svg$/,
        use: ({ resource }) => [
          {
            loader: 'react-svg-loader',
            options: {
              svgo: {
                floatPrecision: 2,
                plugins: [
                  { removeTitle: false },
                  {
                    cleanupIDs: {
                      force: true,
                      prefix: `svg-${simple(
                        path.relative(__dirname, resource),
                      )}`,
                    },
                  },
                  { removeViewBox: false },
                ],
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: 'all',
          name: 'vendor',
          priority: -20,
          test: /node_modules/,
        },
      },
    },
  },
  output: {
    chunkFilename: '[chunkhash].js',
    filename: '[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    sourceMapFilename: '../../sourcemap/[file].map',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],
  resolve: {
    alias: {
      '@prop-types': path.resolve(__dirname, 'lib', 'prop-types'),
      '@styled-components': path.resolve(__dirname, 'lib', 'styled-components'),
      Components: path.resolve(SRC, 'components'),
      Providers: path.resolve(SRC, 'providers'),
      Views: path.resolve(SRC, 'views'),
      'react-dom': '@hot-loader/react-dom',
    },
  },
};
