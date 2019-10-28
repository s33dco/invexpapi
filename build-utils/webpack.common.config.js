const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const getValue = require('config');
const webpack = require('webpack');
const { appEntry } = require('./common-paths');

const apiURL = getValue.get('apiURL');

module.exports = {
	entry: appEntry,
	node: {
		net: 'empty',
		tls: 'empty',
		dns: 'empty'
	},
	mode: 'none',
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: './index.html'
		}),
		new CopyWebpackPlugin([{ from: './src/static/images', to: './images' }]),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}),
		new webpack.DefinePlugin({
			'process.env.API_URL': JSON.stringify(apiURL)
		})
	]
};
