const express = require('express');
const morgan = require('morgan');
const path = require('path');
const config = require('config');
const cors = require('cors');
const logger = require('./logger');
const removeEmptyProperties = require('../middleware/omitEmpty');
const api = require('../routes/api');
const users = require('../routes/users');
const auth = require('../routes/auth');
const businesses = require('../routes/businesses');
const clients = require('../routes/clients');
const expenses = require('../routes/expenses');
const invoices = require('../routes/invoices');

const initialize = app => {
	const corsOptions = {
		origin: '*',
		optionsSuccessStatus: 200,
	};

	const middlewares = [
		morgan('dev', { stream: logger.stream }),
		express.json({ extended: false }),
		cors(corsOptions),
		removeEmptyProperties(),
	];

	app.use(middlewares);

	// define Routes

	app.use('/api/users', users);
	app.use('/api/auth', auth);
	app.use('/api/businesses', businesses);
	app.use('/api/clients', clients);
	app.use('/api/expenses', expenses);
	app.use('/api/invoices', invoices);
	app.use('/api', api);

	// serve static assests in production
	if (config.util.getEnv('NODE_ENV') === 'production') {
		app.use(express.static('build'));
		app.get('*', (req, res) => {
			res.sendFile(path.resolve(__dirname, '../../build/index.html'));
		});
	}
};

module.exports = initialize;
