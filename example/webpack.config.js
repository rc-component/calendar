'use strict'
const webpack = require('webpack')
const cssnext = require('postcss-cssnext')
const path = require('path')
const BellOnBundlerErrorPlugin = require('bell-on-bundler-error-plugin')

let plugins = [
  new webpack.optimize.OccurenceOrderPlugin()
]

plugins.push(new BellOnBundlerErrorPlugin()),
plugins.push(new webpack.HotModuleReplacementPlugin())


const config = {
  entry: {
    'main': ['webpack-hot-middleware/client', './index']
  },
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|web_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['transform-runtime']
        }
      }, {
        test: /\.css$/,
        loader: 'style!css?sourceMap&modules&localIdentName=[name]__[local]__[hash:base64:5]!postcss',
        include: path.resolve(__dirname, '../')
      }
    ]
  },
  postcss: [cssnext()],
  plugins: plugins
}

module.exports = config
