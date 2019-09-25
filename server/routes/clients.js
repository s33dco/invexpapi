const express = require('express');
const logger = require('../startup/logger');
const auth = require('../middleware/auth');
const { Client, validate } = require('../models/client');

const router = express.Router();

router.get('/', auth, async (req, res) => {
	try {
		const clients = await Client.findUsersClients(req.user.id);

		if (clients.length < 1) {
			res.status(404).json({
				msg: 'You need to add atleast one client before proceeding.'
			});
		} else {
			const clientJSON = clients.map(client => client.toObject());
			res.status(200).json(clientJSON);
		}
	} catch (error) {
		logger.error(error.message);
		res.status(500).send('server error');
	}
});

router.post('/', auth, async (req, res) => {
	const clientDetails = { userId: req.user.id, ...req.body };

	const { error } = validate(clientDetails);

	if (error) {
		logger.warn(
			`failed client details from ${req.user.name} (${req.user.id}) - ${error.details[0].message}`
		);
		return res.status(400).json({ msg: error.details[0].message });
	}

	try {
		const client = new Client(clientDetails);
		await client.save();
		res.status(200).json(client.toObject());
	} catch (e) {
		res.status(500).send(`server error ${e}`);
	}
});

router.put('/:id', auth, async (req, res) => {
	// add userId to req.body to pass validation..
	const clientDetails = { userId: req.user.id, ...req.body };
	// validate the object
	const { error } = validate(clientDetails);
	// reject any validation errors
	if (error) {
		logger.warn(
			`failed client details from ${req.user.name} (${req.user.id}) - ${error.details[0].message}`
		);
		return res.status(400).json({ msg: error.details[0].message });
	}
	// retrieve the record by id
	try {
		let client = await Client.findById(req.params.id);
		// throw error if not found
		if (!client) {
			return res.status(404).json({
				msg: 'client details not found.'
			});
		}
		// throw error if logged in user not match user on client record
		if (client.userId.toString() !== req.user.id.toString()) {
			return res.status(403).json({ msg: 'Not Authorised' });
		}
		// save and return updated record..
		client = await Client.findByIdAndUpdate(
			req.params.id,
			{ $set: { ...req.body } },
			{ new: true }
		);
		res.json(client.toObject());
	} catch (e) {
		res.status(500).send(`server error ${e}`);
	}
});

router.get('/:id', auth, async (req, res) => {
	// retrieve the record by id
	try {
		const client = await Client.findById(req.params.id);
		// throw error if not found
		if (!client) {
			return res.status(404).json({
				msg: 'Client details not found'
			});
		}
		// throw error if logged in user not match user on client record
		if (client.userId.toString() !== req.user.id.toString()) {
			return res.status(403).json({ msg: 'Not Authorised' });
		}

		res.json(client.toObject());
	} catch (e) {
		res.status(500).send(`server error ${e}`);
	}
});

router.delete('/:id', auth, async (req, res) => {
	// retrieve the record by id
	try {
		let client = await Client.findById(req.params.id);
		// throw error if not found
		if (!client) {
			return res.status(404).json({ msg: 'Client details not found' });
		}
		// throw error if logged in user not match user on client record
		if (client.userId.toString() !== req.user.id.toString()) {
			return res.status(403).json({ msg: 'Not Authorised' });
		}

		// TODO - check if client on any invoice....

		client = await Client.findByIdAndRemove(req.params.id);

		res.status(200).json({
			msg: `${client.name} deleted!`
		});
	} catch (e) {
		res.status(500).send(`server error ${e}`);
	}
});

module.exports = router;
