const logger = require('../startup/logger');

module.exports = token => {
	const fullToken = token;
	const parts = fullToken.split('.');
	const signature = parts[2];
	const headPay = parts[0].concat('.', parts[1]);
	logger.info(
		`token generated : ${fullToken},\npayload: ${headPay},\nsignature: ${signature}`
	);

	return { fullToken, signature, headPay };
};
