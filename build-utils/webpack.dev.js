const webpack = require('webpack');
const portConfig = require('config');
const { appEntry, devOutput } = require('./common-paths');

const frontendPort = portConfig.get('frontend_port');

const config = {
	mode: 'none',
	entry: {
		app: appEntry
	},
	output: {
		path: devOutput,
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: 'react-hot-loader/webpack',
				include: /node_modules/
			},
			{
				test: /\.s?css$/,
				use: [
					{
						loader: 'style-loader',
						options: { sourceMap: true }
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
							localsConvention: 'camelCase',
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				]
			}
		]
	},
	optimization: {
		minimize: false
	},
	devtool: 'inline-source-map',
	plugins: [new webpack.HotModuleReplacementPlugin()],
	devServer: {
		host: 'localhost',
		port: frontendPort,
		historyApiFallback: true,
		hot: true,
		open: 'Google Chrome'
	}
};
module.exports = config;
