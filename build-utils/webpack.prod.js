const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const { appEntry, prodOutput } = require('./common-paths');

const config = {
	mode: 'none',
	entry: {
		app: appEntry
	},
	output: {
		path: prodOutput,
		publicPath: '/'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [
					{
						// We configure 'MiniCssExtractPlugin'
						loader: MiniCssExtractPlugin.loader
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
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'styles/styles.[hash].css'
		})
	],
	optimization: {
		minimize: true,
		minimizer: [
			new TerserJSPlugin({ sourceMap: true }),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					map: {
						inline: false
					}
				}
			})
		]
	}
};
module.exports = config;
