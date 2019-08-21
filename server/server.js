const config = require('config');
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const app = require('./app');
const logger = require('./startup/logger');

const environment = process.env.NODE_ENV || 'development';
const port = process.env.PORT || config.get('backend_port');

if (environment === 'development') {
	const httpsPort = port + 1;
	const certOptions = {
		key: fs.readFileSync(path.resolve(__dirname, '../config', 'server.key')),
		cert: fs.readFileSync(path.resolve(__dirname, '../config', 'server.crt'))
	};
	https.createServer(certOptions, app).listen(httpsPort, () => {
		logger.info(
			`** https server running in ${environment} listening on port ${httpsPort}...`
		);
	});
}
http.createServer(app).listen(port, () => {
	logger.info(
		`** server running in ${environment} listening on port ${port}...`
	);
});
