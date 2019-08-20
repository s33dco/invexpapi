const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const logger = require('../startup/logger');
const auth = require('../middleware/auth');
const { User, validateLogin } = require('../models/user');

const router = express.Router();

// @route GET api/auth
// @desc get logged in user
// @access Private

router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('name email id');
		res.status(200).json(user);
	} catch (error) {
		logger.error(error.message);
		res.status(500).send('server error');
	}
});

// @route POST api/auth
// @desc auth user and get token
// @access public

router.post('/', async (req, res) => {
	const { error } = validateLogin(req.body);

	if (error) {
		logger.warn(`failed login attempt from ${req.ip} using ${req.body.email}`);
		return res.status(400).json({ msg: error.details[0].message });
	}

	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ msg: 'Invalid Credentials' });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ msg: 'Invalid Credentials' });
		}

		const payload = {
			user: {
				id: user.id,
				name: user.name
			}
		};

		jwt.sign(
			payload,
			config.get('jwt_secret'),
			{
				expiresIn: 3600
			},
			(err, token) => {
				if (err) throw err;

				res.json({ token });
			}
		);
	} catch (e) {
		logger.error(e.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
