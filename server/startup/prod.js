const compression = require('compression');
const helmet = require('helmet');

const inProduction = app => {
	app.use(helmet());
	app.use(compression());
};

module.exports = inProduction;
