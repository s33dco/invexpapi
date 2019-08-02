const config = require('config');
const app = require('./app');
const logger = require('./startup/logger');

const environment = process.env.NODE_ENV || 'development';
const port = process.env.PORT || config.get('backend_port');

app.listen(port, () => {
	logger.info(
		`** server running in ${environment} listening on port ${port}...`
	);
});
