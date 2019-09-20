const express = require('express');
const logger = require('../startup/logger');
const auth = require('../middleware/auth');
const { Business, validate } = require('../models/business');

const router = express.Router();

router.get('/', auth, async (req, res) => {
	try {
		const business = await Business.findUsersBusiness(req.user.id).select(
			'-__v -userId'
		);

		if (!business) {
			res.status(404).json({
				msg:
					'You need to add your business details (Invoice Info) before proceeding.'
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
	const businessDetails = { userId: req.user.id, ...req.body };
	const { error } = validate(businessDetails);

	if (error) {
		logger.warn(
			`failed business details from ${req.user.name} (${req.user.id}) - ${error.details[0].message}`
		);
		return res.status(400).json({ msg: error.details[0].message });
	}

	try {
		const dupe = await Business.findUsersBusiness(req.user.id);
		if (dupe) {
			return res.status(400).json({
				msg: `business details already exist for ${req.user.name} - please edit if the details have changed`
			});
		}
		const business = new Business(businessDetails);
		await business.save();
		res.status(200).json(business);
	} catch (e) {
		res.status(500).send(`server error ${e}`);
	}
});

router.put('/:id', auth, async (req, res) => {
	// add userId to req.body to pass validation..
	const businessDetails = { userId: req.user.id, ...req.body };
	// validate the object
	const { error } = validate(businessDetails);
	// reject any validation errors
	if (error) {
		logger.warn(
			`failed business details from ${req.user.name} (${req.user.id}) - ${error.details[0].message}`
		);
		return res.status(400).json({ msg: error.details[0].message });
	}
	// retrieve the record by id
	try {
		let business = await Business.findById(req.params.id);
		// throw error if not found
		if (!business) {
			return res.status(404).json({
				msg: 'Business details not found.'
			});
		}
		// throw error if logged in user not match user on business record
		if (business.userId.toString() !== req.user.id.toString()) {
			return res.status(403).json({ msg: 'Not Authorised' });
		}
		// save and return updated record..
		business = await Business.findByIdAndUpdate(
			req.params.id,
			{ $set: { ...req.body } },
			{ new: true }
		);
		res.json(business);
	} catch (e) {
		res.status(500).send(`server error ${e}`);
	}
});

module.exports = router;
