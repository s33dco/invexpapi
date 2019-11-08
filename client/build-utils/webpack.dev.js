const path = require('path');
const webpack = require('webpack');
const fs = require('fs')

module.exports = {
	mode: 'none',
	devtool: 'eval-source-map',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: 'react-hot-loader/webpack',
				include: /node_modules/,
			},
			{
				test: /\.s?css$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
	output: {
		path: path.resolve(__dirname, '../../dev'),
		publicPath: '/',
		filename: 'bundle.js',
	},
	devServer: {
		contentBase: path.resolve(__dirname, './src'),
		hot: true,
		open: 'Google Chrome',
		https: {
      key: fs.readFileSync('../config/server.key'),
      cert: fs.readFileSync('../config/server.crt')
    }
	},
};
