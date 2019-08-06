const mongoose = require('mongoose');
const moment = require('moment');
const { Expense } = require('../../models/expense');

const savedExpense = () => {
	return new Expense({
		userId: mongoose.Types.ObjectId(),
		date: moment().format(),
		category: 'Office, property and equipment',
		amount: 123.23,
		desc: 'some paper and stationary supplies'
	}).save();
};

const unsavedExpense = () => {
	return new Expense({
		userId: mongoose.Types.ObjectId(),
		date: moment().format(),
		category: 'Office, property and equipment',
		amount: 123.23,
		desc: 'some paper and stationary supplies'
	});
};

module.exports = { savedExpense, unsavedExpense };
