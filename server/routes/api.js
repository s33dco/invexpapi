const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	const message = {
		msg: 'welcome to the api'
	};
	res.status(200).json(message);
});

module.exports = router;
