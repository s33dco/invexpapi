const path = require('path');
const webpack = require('webpack');
// const portConfig = require('config');

// const frontendPort = portConfig.get('frontend_port');

module.exports = {
	mode: 'development',
	devtool: 'eval-source-map',
	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
	output: {
		path: path.resolve(__dirname, '../', 'dev'),
		publicPath: '/',
		filename: 'bundle.js',
	},
	devServer: {
		contentBase: './dev',
		hot: true,
		open: 'Google Chrome',
	},
};
