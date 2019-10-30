const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const getValue = require('config');

const apiURL = getValue.get('apiURL');

module.exports = {
	entry: './src/index.js',
	node: {
		net: 'empty',
		// tls: 'empty',
		// dns: 'empty',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader'], // , 'eslint-loader'
			},
		],
	},
	resolve: {
		extensions: ['*', '.js', '.jsx'],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		new CopyWebpackPlugin([
			{ from: './src/static/images', to: './images' },
		]),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		}),
		new webpack.DefinePlugin({
			'process.env.API_URL': JSON.stringify(apiURL),
		}),
	],
};
