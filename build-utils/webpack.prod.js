const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, '../', 'build'),
		publicPath: '/',
		filename: '[name].[contenthash].js',
	},
	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
							localsConvention: 'camelCase',
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: true },
					},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'styles/styles.[contenthash].css',
		}),
		new webpack.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
	],

	// optimization: {
	// 	minimize: true,
	// 	minimizer: [
	// 		new TerserJSPlugin({ sourceMap: true }),
	// 		new OptimizeCSSAssetsPlugin({
	// 			cssProcessorOptions: {
	// 				map: {
	// 					inline: false,
	// 				},
	// 			},
	// 		}),
	// 	],
	// 	// runtimeChunk: 'single',
	// 	// splitChunks: {
	// 	// 	chunks: 'all',
	// 	// 	maxInitialRequests: Infinity,
	// 	// 	minSize: 0,
	// 	// 	cacheGroups: {
	// 	// 		vendor: {
	// 	// 			test: /[\\/]node_modules[\\/]/,
	// 	// 			name(module) {
	// 	// 				// get the name. E.g. node_modules/packageName/not/this/part.js
	// 	// 				// or node_modules/packageName
	// 	// 				const packageName = module.context.match(
	// 	// 					/[\\/]node_modules[\\/](.*?)([\\/]|$)/
	// 	// 				)[1];

	// 	// 				// npm package names are URL-safe, but some servers don't like @ symbols
	// 	// 				return `npm.${packageName.replace('@', '')}`;
	// 	// 			},
	// 	// 		},
	// 	// 	},
	// 	// },

	// 	splitChunks: {
	// 		cacheGroups: {
	// 			styles: {
	// 				name: 'styles',
	// 				test: /\.css$/,
	// 				chunks: 'all',
	// 				enforce: true,
	// 			},
	// 			vendor: {
	// 				chunks: 'initial',
	// 				test: 'vendor',
	// 				name: 'vendor',
	// 				enforce: true,
	// 			},
	// 		},
	// 	},
	// },
	devServer: {
		contentBase: './build',
	},
};
