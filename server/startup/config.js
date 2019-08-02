const config = require('config');
const logger = require('./logger');

const checkConfig = () => {
	logger.info(`** reading config values...`);

	try {
		if (!config.get('mongodbURI')) {
			throw new Error('FATAL ERROR: mongodbURI is not defined.');
		}
		if (!config.get('backend_port')) {
			throw new Error('FATAL ERROR: PORT is not defined.');
		}
		if (!config.get('sendgrid_password')) {
			throw new Error('FATAL ERROR: sendgrid_password is not defined.');
		}
		logger.info(`** successfully read...`);
		logger.info(`** starting in ${config.util.getEnv('NODE_ENV')}...`);
	} catch (e) {
		logger.error(`Missing config setting\n${e.message}\n${e.stack}`);
		process.exit(1);
	}
};

module.exports = checkConfig;
