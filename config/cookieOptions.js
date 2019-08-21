const sigOptions = {
	httpOnly: true,
	secure: true,
	sameSite: 'Strict'
};

const payOptions = {
	maxAge: 1000 * 60 * 30, // would expire after 30 minutes
	secure: true,
	sameSite: 'Strict'
};

module.exports = { sigOptions, payOptions };
