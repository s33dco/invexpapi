const webpackMerge = require('webpack-merge');
const config = require('config');
const commonConfig = require('./build-utils/webpack.common');
const devConfig = require('./build-utils/webpack.dev');
const prodConfig = require('./build-utils/webpack.prod');
const logger = require('./server/startup/logger');

module.exports = env => {
	let envConfig;
	if (env === 'prod') {
		envConfig = prodConfig;
	} else {
		envConfig = devConfig;
	}
	logger.info(`building for ${config.util.getEnv('NODE_ENV')}`);
	return webpackMerge(commonConfig, envConfig);
};
