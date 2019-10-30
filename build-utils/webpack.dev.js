const path = require('path');
const webpack = require('webpack');
const getConfig = require('config');

const frontendPort = getConfig.get('frontend_port');

module.exports = {
	mode: 'none',
	devtool: 'eval-source-map',
	optimization: {
		minimize: false,
	},
	output: {
		path: path.resolve(__dirname, '../', 'dev'),
		publicPath: '/',
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
							localsConvention: 'camelCase',
						},
					},
					{
						loader: 'sass-loader',
					},
				],
			},
		],
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
	devServer: {
		contentBase: './dev',
		port: frontendPort,
		hot: true,
		open: 'Google Chrome',
	},
};
