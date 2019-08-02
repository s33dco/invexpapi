const express = require('express');
const morgan = require('morgan');
const path = require('path');
const config = require('config');
const logger = require('./logger');
const api = require('../routes/api');

const initialize = app => {
	const middlewares = [
		morgan('dev', { stream: logger.stream }),
		express.json({ extended: false })
	];

	app.use(middlewares);

	// define Routes

	app.use('/api', api);

	// serve static assests in production
	if (config.util.getEnv('NODE_ENV') === 'production') {
		app.use(express.static('build'));
		app.get('*', (req, res) => {
			res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
		});
	}
};

module.exports = initialize;
