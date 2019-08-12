const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let ENV = process.env.ENV
let isDev = ENV !== 'production'

module.exports = {
  mode: ENV || 'development',
  entry: './demo/index.tsx',
  devtool: isDev && 'source-map-cheap-eval',
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'docs'),
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      title: 'visual effects demo',
      template: './demo/index.html',
    }),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: { allowTsInNodeModules: true },
          },
        ],
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'demo'), /@drewxiu/],
      },
      {
        test: /\.(css|scss|sass)$/,
        exclude: [/node_modules/, path.resolve(__dirname, '../src/css/3rd.scss')],
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      },
    ],
  },

  devServer: {
    open: true,
  },
}
