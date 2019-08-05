const mongoose = require('mongoose');
const config = require('config');
const logger = require('./logger');

const db = config.get('mongodbURI');

const connectDB = async () => {
	mongoose.set('debug', (collectionName, method, query, doc) => {
		logger.info(
			`[Mongoose] ${collectionName}.${method} ${JSON.stringify(
				query
			)} ${JSON.stringify(doc)}\n`
		);
	});

	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false
		});
		logger.info(`** connected to ${config.util.getEnv('NODE_ENV')} db...\n`);
	} catch (e) {
		logger.error(
			`** Could not connect to ${config.util.getEnv('NODE_ENV')} db :-( **\n ${
				e.message
			} `
		);
		process.exit(1);
	}
};

const disconnectDB = async () => {
	try {
		await mongoose.disconnect();
		logger.info(`**${config.util.getEnv('NODE_ENV')} db disconnected\n`);
	} catch (e) {
		logger.error(
			`** Could not disconnect to ${config.util.getEnv(
				'NODE_ENV'
			)} db :-( **\n ${e.message} `
		);
		process.exit(1);
	}
};

module.exports = { connectDB, disconnectDB };
