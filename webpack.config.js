const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body',
});

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
  },
  resolve: {
    modules: [
      path.resolve(__dirname),
      'node_modules',
    ],
    alias: {
      styles: 'src/sass/style.sass',
    },
  },
  module: {
    rules: [{
      test: /\.js?/,
      loaders: [
        'babel-loader',
        'eslint-loader',
      ],
      exclude: /node_modules/,
    }, {
      test: /\.sass$/,
      use: [{
        loader: 'style-loader',
        options: { sourceMap: true },
      }, {
        loader: 'css-loader',
        options: { sourceMap: true },
      }, {
        loader: 'sass-loader',
        options: { sourceMap: true },
      }],
    }],
  },
  plugins: [HtmlWebpackPluginConfig],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    port: 8080,
    publicPath: 'dist',
    watchContentBase: true,
  },
  // devtool: 'cheap-module-eval-source-map',
};

module.exports = config;
