const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const getValue = require('config');
const webpack = require('webpack');
const { appEntry } = require('./common-paths');

const api_url = getValue.get('apiURL');

const config = {
	entry: appEntry,
	node: {
		net: 'empty',
		tls: 'empty',
		dns: 'empty'
	},

	// vendor: ['semantic-ui-react'], - use to chunk vendor components
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			}
		]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				styles: {
					name: 'styles',
					test: /\.css$/,
					chunks: 'all',
					enforce: true
				},
				vendor: {
					chunks: 'initial',
					test: 'vendor',
					name: 'vendor',
					enforce: true
				}
			}
		}
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
			'process.env.API_URL': JSON.stringify(api_url)
		})
	]
};
module.exports = config;
