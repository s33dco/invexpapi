const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
	// get token from header

	const token = req.header('x-auth-token');

	// check if not token
	if (!token) {
		return res.status(401).json({ msg: 'Not Authorised' });
	}

	try {
		const decoded = jwt.verify(token, config.get('jwt_secret'));
		req.user = decoded.user;
		next();
	} catch (error) {
		res.status(403).json({ msg: 'Not Authorised' });
	}
};

// const jwt = require('jsonwebtoken');
// const config = require('config');

// module.exports = (req, res, next) => {
// 	// get 2 cookies from header to make jwt

// 	const { payload, signature } = req.cookies;

// 	// if not found reject
// 	if (!signature || !payload) {
// 		return res.status(401).json({ msg: 'Not Authorised' });
// 	}

// 	// put together and auth...
// 	try {
// 		const token = payload.concat('.', signature);
// 		const decoded = jwt.verify(token, config.get('jwt_secret'));
// 		req.user = decoded.user;
// 		next();
// 	} catch (error) {
// 		res.status(403).json({ msg: 'Authorisation Failed' });
// 	}
// };
