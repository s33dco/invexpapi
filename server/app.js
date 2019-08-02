const express = require('express');
const config = require('config');
const checkConfig = require('./startup/config.js');
const connectDB = require('./startup/db.js');
const initialize = require('./startup/routes.js');
const inProduction = require('./startup/prod.js');

const app = express();

checkConfig();
connectDB();
initialize(app);

if (config.util.getEnv('NODE_ENV') === 'production') {
	inProduction(app);
}

module.exports = app;
