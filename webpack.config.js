const config = require('config');
const devConfig = require('./build-utils/webpack.dev.config');
const prodConfig = require('./build-utils/webpack.prod.config');
const logger = require('./server/startup/logger');

module.exports = env => {
	logger.info(`building for ${config.util.getEnv('NODE_ENV')} - (${env})`);

	if (env === 'prod') {
		return prodConfig;
	}
	return devConfig;
};
