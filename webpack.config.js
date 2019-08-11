const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let ENV = process.env.ENV
let isDev = ENV !== 'production'

module.exports = {
  mode: ENV || 'development',
  entry: './src/demo.ts',
  devtool: isDev && 'source-map-cheap-eval',
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      title: 'visual effects demo',
      template: './src/demo.html',
    }),
  ],

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
        include: [/node_modules\/noru-utils/, path.resolve(__dirname, 'src')],
      },
    ],
  },

  devServer: {
    open: true,
  },

  resolve: {
    extensions: ['.tsx', '.ts'],
  },
}
