const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, (req, res) => {
	const message = {
		msg:
			'welcome to the api, this confirms your cookies are in order, feel free to hit the other endpoints.'
	};
	res.status(200).json(message);
});

module.exports = router;
