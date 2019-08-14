// const logger = require('../startup/logger');

// module.exports = (err, req, res, next) => {
// 	if (!err.statusCode) {
// 		req.flash('alert', 'Ouch!');
// 		err.statusCode = 500;
// 		err.tag = 'Something broke !';
// 		err.message =
// 			"Well that was unexpected, no matter we'll have it sorted soon.";
// 	}

// 	res.status(err.statusCode);

// 	logger.error(
// 		`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack}`
// 	);

// 	res.render('error', {
// 		errorCode: err.statusCode,
// 		errorTag: err.tag,
// 		errorMessage: err.message,
// 		pageTitle: err.statusCode,
// 		pageDescription: `${err.tag}`
// 	});
// };
