require('winston-daily-rotate-file');
require('winston-mongodb');
const config = require('config');
const { createLogger, format, transports } = require('winston');
const fs = require('fs');

const loggingDB = config.get('mongodbURI');
const env = config.util.getEnv('NODE_ENV');
const logDir = 'log';
const logLevel = () => {
	if (env === 'development') {
		return 'debug';
	}
	if (env === 'test') {
		return 'error';
	}
	return 'info';
};

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
	filename: `${logDir}/%DATE%.log`,
	datePattern: 'DD-MM-YYYY',
	handleExceptions: true,
	exitOnError: true
});

const logger = createLogger({
	// change level if in dev environment versus production
	level: logLevel(),
	format: format.combine(
		format.colorize(),
		format.timestamp({
			format: 'DD-MM-YY HH:mm:ss'
		}),
		format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`) // standard includes timestamp
	),
	transports: [
		dailyRotateFileTransport, // log to rotating file

		new transports.Console({
			handleExceptions: true,
			silent: env === 'test', // no logging to console if running in test..
			exitOnError: true,
			format: format.combine(
				format.colorize(),
				format.printf(
					info => `${info.level}: ${info.message}` // not printing timestamp to console
				)
			),
			prettyPrint: true
		}),

		new transports.MongoDB({
			handleExceptions: true,
			silent: env === 'test', // no logging to console if running in test..
			exitOnError: true,
			db: loggingDB,
			collection: 'logging',
			level: 'error', // send errors to db
			storeHost: true,
			expireAfterSeconds: 172800, // 48 hours
			capped: true,
			options: { poolSize: 2, autoReconnect: true, useNewUrlParser: true }
		})
	]
});

logger.stream = {
	// stream for morgan
	write: message => {
		// use the 'info' log level so the output will be picked up by both transports (file and console)
		logger.info(message);
	}
};

process.on('unhandledRejection', e => {
	logger.error(`Unhandled Rejection : ${e.message}`);
	throw Error(`from unhandled rejection ${e.stack}`);
});

module.exports = logger;
