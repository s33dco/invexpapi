const express = require('express');
const logger = require('../startup/logger');
const auth = require('../middleware/auth');
const { User } = require('../models/user');
const { Business, validate } = require('../models/business');

const router = express.Router();

router.get('/', auth, async (req, res) => {
	try {
		const business = await Business.findUsersBusiness(req.user.id).select(
			'-__v -userId'
		);
		if (!business) {
			res.status(400).json({
				msg: 'you need to add your business details before proceeding'
			});
		} else {
			res.status(200).json(business);
		}
	} catch (error) {
		logger.error(error.message);
		res.status(500).send('server error');
	}
});

router.post('/', auth, async (req, res) => {
	const { error } = validate(req.body);

	if (error) {
		logger.warn(
			`failed business details from ${req.user.name} (${req.user.id}) - ${error.details[0].message}`
		);
		return res.status(400).json({ msg: error.details[0].message });
	}

	try {
		const owner = await User.findById(req.body.userId);

		if (!owner || req.body.userId !== req.user.id) {
			logger.warn(
				`user details mismatch on create business, logged in as ${req.user.name} (${req.user.id}) -  id passed on form as ${req.body.userId}`
			);
			return res.status(400).json({
				msg: "Something doesn't add up, give it another go"
			});
		}

		const dupe = await Business.findUsersBusiness(req.user.id);

		if (dupe) {
			return res.status(400).json({
				msg: `business details already exist for ${req.user.name} - please edit if they have changed`
			});
		}

		const business = new Business({ ...req.body });
		await business.save();
		res.status(200).json(business);
	} catch (e) {
		res.status(500).send(`server error ${e}`);
	}
});

module.exports = router;
