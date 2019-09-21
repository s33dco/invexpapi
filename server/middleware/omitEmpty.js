const omitEmpty = require('omit-empty');

const removeEmptyProperties = () => {
	return function(req, res, next) {
		req.body = omitEmpty(req.body);
		req.params = omitEmpty(req.params);
		req.query = omitEmpty(req.query);
		next();
	};
};

module.exports = removeEmptyProperties;
