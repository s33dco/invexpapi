const express = require('express');
const logger = require('../startup/logger');
const auth = require('../middleware/auth');
const { Expense, validate } = require('../models/expense');

const router = express.Router();

router.get('/', auth, async (req, res) => {
	try {
		const expenses = await Expense.findUsersExpenses(req.user.id).select(
			'-__v -userId'
		);

		if (expenses.length < 1) {
			res.status(404).json({
				msg: 'you have no expenses so far'
			});
		} else {
			res.status(200).json(expenses);
		}
	} catch (error) {
		logger.error(error.message);
		res.status(500).send('server error');
	}
});

router.post('/', auth, async (req, res) => {
	const expenseDetails = { userId: req.user.id, ...req.body };

	const { error } = validate(expenseDetails);

	if (error) {
		logger.warn(
			`failed expense details from ${req.user.name} (${req.user.id}) - ${error.details[0].message}`
		);
		return res.status(400).json({ msg: error.details[0].message });
	}

	try {
		const expense = new Expense(expenseDetails);
		await expense.save();
		res.status(200).json(expense);
	} catch (e) {
		res.status(500).send(`server error ${e}`);
	}
});

router.put('/:id', auth, async (req, res) => {
	// add userId to req.body to pass validation..
	const expenseDetails = { userId: req.user.id, ...req.body };
	// validate the object
	const { error } = validate(expenseDetails);
	// reject any validation errors
	if (error) {
		logger.warn(
			`failed expense details from ${req.user.name} (${req.user.id}) - ${error.details[0].message}`
		);
		return res.status(400).json({ msg: error.details[0].message });
	}
	// retrieve the record by id
	try {
		let expense = await Expense.findById(req.params.id);
		// throw error if not found
		if (!expense) {
			return res.status(404).json({
				msg: 'expense details not found'
			});
		}
		// throw error if logged in user not match user on expense record
		if (expense.userId.toString() !== req.user.id.toString()) {
			return res.status(403).json({ msg: 'Not Authorised' });
		}
		// save and return updated record..
		expense = await Expense.findByIdAndUpdate(
			req.params.id,
			{ $set: { ...req.body } },
			{ new: true }
		);
		res.json(expense);
	} catch (e) {
		res.status(500).send(`server error ${e}`);
	}
});

router.get('/:id', auth, async (req, res) => {
	// retrieve the record by id
	try {
		const expense = await Expense.findById(req.params.id);
		// throw error if not found
		if (!expense) {
			return res.status(404).json({
				msg: 'expense details not found'
			});
		}
		// throw error if logged in user not match user on expense record
		if (expense.userId.toString() !== req.user.id.toString()) {
			return res.status(403).json({ msg: 'Not Authorised' });
		}

		res.json(expense);
	} catch (e) {
		res.status(500).send(`server error ${e}`);
	}
});

router.delete('/:id', auth, async (req, res) => {
	// retrieve the record by id
	try {
		let expense = await Expense.findById(req.params.id);
		// throw error if not found
		if (!expense) {
			return res.status(404).json({
				msg: 'expense details not found.'
			});
		}
		// throw error if logged in user not match user on expense record
		if (expense.userId.toString() !== req.user.id.toString()) {
			return res.status(403).json({ msg: 'Not Authorised' });
		}

		// TODO - check if expense on any invoice....

		expense = await Expense.findByIdAndRemove(req.params.id);

		res.status(200).json({
			msg: `${expense.desc} deleted!`
		});
	} catch (e) {
		res.status(500).send(`server error ${e}`);
	}
});

module.exports = router;
