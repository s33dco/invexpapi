const express = require('express');
const config = require('config');
const multer = require('multer');
const moment = require('moment');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const logger = require('../startup/logger');
const auth = require('../middleware/auth');
const { Invoice, validate } = require('../models/invoice');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();
const { sentanceCase, titleCase } = require('../../config/textFormat');

router.get('/', auth, async (req, res) => {
	try {
		const invoices = await Invoice.findUsersInvoicesByNumber(req.user.id);

		if (invoices.length < 1) {
			res.status(404).json({
				msg: 'you have no invoices so far'
			});
		} else {
			const invoicesJSON = invoices.map(invoice => invoice.toJSON());

			res.status(200).json(invoicesJSON);
		}
	} catch (error) {
		logger.error(error.message);
		res.status(500).send('server error');
	}
});

router.post('/', auth, async (req, res) => {
	const invoiceDetails = { userId: req.user.id, ...req.body };
	console.log(invoiceDetails);

	const { error } = validate(invoiceDetails);
	if (error) {
		logger.warn(
			`failed invoice details from ${req.user.name} (${req.user.id}) - ${error.details[0].message}`
		);
		return res.status(400).json({ msg: error.details[0].message });
	}
	try {
		const invoice = new Invoice(invoiceDetails);
		await invoice.save();
		// remove unwanted attributes

		res.status(200).json(invoice.toObject());
	} catch (e) {
		console.log(e);
		res.status(400).send(`server error ${e.errors.message}`);
	}
});

router.put('/:id', auth, async (req, res) => {
	// add userId to req.body to pass validation..
	const invoiceDetails = { userId: req.user.id, ...req.body };
	// validate the object
	const { error } = validate(invoiceDetails);
	// reject any validation errors
	if (error) {
		logger.warn(
			`failed invoice details from ${req.user.name} (${req.user.id}) - ${error.details[0].message}`
		);
		return res.status(400).json({ msg: error.details[0].message });
	}
	// retrieve the record by id
	try {
		let invoice = await Invoice.findById(req.params.id);
		// throw error if not found
		if (!invoice) {
			return res.status(400).json({
				msg: 'invoice details not found'
			});
		}
		// throw error if logged in user not match user on invoice record
		if (invoice.userId.toString() !== req.user.id.toString()) {
			return res.status(403).json({ msg: 'Not Authorised' });
		}
		// save and return updated record..
		invoice = await Invoice.findByIdAndUpdate(
			req.params.id,
			{ $set: { ...req.body } },
			{ new: true }
		);
		const invoiceJSON = {
			...invoice.toObject()
		};

		res.status(200).json(invoiceJSON);
	} catch (e) {
		res.status(500).send(`server error ${e.message}`);
	}
});

router.delete('/:id', auth, async (req, res) => {
	// retrieve the record by id
	try {
		let invoice = await Invoice.findById(req.params.id);
		// throw error if not found
		if (!invoice) {
			return res.status(404).json({
				msg: 'invoice details not found.'
			});
		}
		// throw error if logged in user not match user on invoice record
		if (invoice.userId.toString() !== req.user.id.toString()) {
			return res.status(403).json({ msg: 'Not Authorised' });
		}

		if (invoice.paid) {
			return res.status(400).json({ msg: 'Cannot delete a paid invoice' });
		}

		// TODO - check if invoice on any invoice....

		invoice = await Invoice.findByIdAndRemove(req.params.id);

		res.status(200).json({
			msg: `${invoice.desc} deleted!`
		});
	} catch (e) {
		res.status(500).send(`server error ${e.message}`);
	}
});

router.patch('/paid/:id', auth, async (req, res) => {
	try {
		let invoice = await Invoice.findById(req.params.id);
		// throw error if not found
		if (!invoice) {
			return res.status(404).json({
				msg: 'invoice details not found'
			});
		}
		// throw error if logged in user not match user on invoice record
		if (invoice.userId.toString() !== req.user.id.toString()) {
			return res.status(403).json({ msg: 'Not Authorised' });
		}
		// save and return updated record..
		invoice = await Invoice.findOneAndUpdate(
			{ _id: req.params.id },
			{ $set: { paid: true, datePaid: moment().utc() } },
			{ new: true }
		);

		const invoiceJSON = {
			...invoice.toObject()
		};

		res.status(200).json(invoiceJSON);
	} catch (e) {
		res.status(500).send(`server error ${e.message}`);
	}
});

router.patch('/unpaid/:id', auth, async (req, res) => {
	try {
		let invoice = await Invoice.findById(req.params.id);
		// throw error if not found
		if (!invoice) {
			return res.status(404).json({
				msg: 'invoice details not found'
			});
		}
		// throw error if logged in user not match user on invoice record
		if (invoice.userId.toString() !== req.user.id.toString()) {
			return res.status(403).json({ msg: 'Not Authorised' });
		}
		// save and return updated record..
		invoice = await Invoice.findOneAndUpdate(
			{ _id: req.params.id },
			{ $set: { paid: false }, $unset: { datePaid: '' } },
			{ new: true }
		);

		const invoiceJSON = {
			...invoice.toObject()
		};

		res.status(200).json(invoiceJSON);
	} catch (e) {
		res.status(500).send(`server error ${e.message}`);
	}
});

router.post('/email', [auth, upload.single('file')], async (req, res) => {
	const {
		to,
		greeting,
		clientName,
		businessName,
		from,
		message,
		contact,
		farewell,
		invNo,
		total,
		fileName,
		_id,
		paid
	} = req.body;

	console.log('greeting from req.body', greeting);

	const transporter = nodemailer.createTransport(
		sendgridTransport({
			auth: {
				api_key: config.get('SENDGRID_API_PASSWORD')
			}
		})
	);

	const options = {
		from: from,
		to: to,
		replyTo: from,
		subject: `Invoice ${invNo} (£${total})`,
		html: `${titleCase(greeting)}<br /><br />${sentanceCase(
			message
		)}<br /><br />${farewell}<br />${titleCase(contact)}<br />`,
		attachments: [
			{
				filename: fileName,
				content: Buffer.from(req.file.buffer, 'utf-8')
			}
		]
	};

	transporter.sendMail(options, (error, info) => {
		if (error) {
			logger.error(`send email error: ${error.message} - ${error.stack}`);
			res.status(500).json({ msg: `email failed` });
		} else {
			logger.info(`${businessName} - Invoice ${invNo} mailed to ${clientName}`);
		}
	});

	invoice = await Invoice.findOneAndUpdate(
		{ _id: _id },
		{ $set: { emailSent: moment().utc() } },
		{ new: true }
	);

	const invoiceJSON = {
		...invoice.toObject()
	};

	res.status(200).json(invoiceJSON);
});

// router.get('/:id', auth, async (req, res) => {
// 	// retrieve the record by id
// 	try {
// 		const invoice = await Invoice.findById(req.params.id);
// 		// throw error if not found
// 		if (!invoice) {
// 			return res.status(404).json({
// 				msg: 'invoice details not found'
// 			});
// 		}
// 		// throw error if logged in user not match user on invoice record
// 		if (invoice.userId.toString() !== req.user.id.toString()) {
// 			return res.status(403).json({ msg: 'Not Authorised' });
// 		}

// 		res.json(invoice.toObject());
// 	} catch (e) {
// 		res.status(500).send(`server error ${e.message}`);
// 	}
// });

module.exports = router;
