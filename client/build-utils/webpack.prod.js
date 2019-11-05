const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'none',
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, '../../build'),
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
		new webpack.HashedModuleIdsPlugin(),
	],

	optimization: {
		minimize: true,
		minimizer: [
			new TerserJSPlugin({ sourceMap: true }),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					map: {
						inline: false,
					},
				},
			}),
		],
		splitChunks: {
			// chunks: 'all',
			// maxInitialRequests: Infinity,
			// minSize: 0,
			cacheGroups: {
				styles: {
					name: 'styles',
					test: /\.css$/,
					chunks: 'all',
					enforce: true,
				},
				// vendor: {
				// 	test: /[\\/]node_modules[\\/]/,
				// 	name(module) {
				// 		const packageName = module.context.match(
				// 			/[\\/]node_modules[\\/](.*?)([\\/]|$)/
				// 		)[1];
				// 	},
				// },
			},
		},
	},
	devServer: {
		contentBase: './build',
	},
};
