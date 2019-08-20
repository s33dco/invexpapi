const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const logger = require('../startup/logger');
const { User, validate } = require('../models/user');

const router = express.Router();

// @route POST api/users
// @desc Register a user
// @access Public

router.post('/', async (req, res) => {
	const { error } = validate(req.body);

	if (error) {
		logger.warn(
			`failed registration attempt from ${req.ip} using ${req.body.email}`
		);
		return res.status(400).json({ msg: error.details[0].message });
	}

	const { name, email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (user) {
			logger.info('failed registration attempt - Email already used.');
			return res.status(400).json({ msg: 'User already exists' });
		}

		// create user

		user = new User({
			name,
			email,
			password
		});

		const salt = await bcrypt.genSalt(10);

		// hash password

		user.password = await bcrypt.hash(password, salt);

		// save user

		await user.save();

		// create jwt

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

				// send jwt
				const fullToken = token;
				const parts = fullToken.split('.');
				const signature = parts[2];
				const headPay = parts[0].concat('.', parts[1]);
				logger.info(`token - ${fullToken}`);
				logger.info(`header/payload - ${headPay}`);
				logger.info(`signature -  ${signature}`);

				res.json({ token });
			}
		);
		logger.info(`${user.name} has logged in...`);
	} catch (err) {
		logger.error(err.message);
		res.status(500).send('server error');
	}
});

module.exports = router;
