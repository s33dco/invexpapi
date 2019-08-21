const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
	// get token from header

	const { payload } = req.cookies;
	const { signature } = req.cookies;

	// check if not token
	if (!signature) {
		return res.status(401).json({ msg: 'Authorization denied' });
	}

	try {
		const token = payload.concat('.', signature);
		console.log(token);
		const decoded = jwt.verify(token, config.get('jwt_secret'));
		req.user = decoded.user;
		next();
	} catch (error) {
		res.status(401).json({ msg: 'token is not valid' });
	}
};
