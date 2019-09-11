const mongoose = require('mongoose');
const moment = require('moment');
const Joi = require('@hapi/joi');
const { businessName, objectId } = require('../../config/regexps');

const categories = {
	values: [
		'Office, property and equipment',
		'Car, van and travel expenses',
		'Clothing expenses',
		'Staff expenses',
		'Reselling goods',
		'Legal and financial costs',
		'Mktg, entertainment and subs'
	],
	message: 'Select a valid option'
};

const expenseSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	date: {
		type: Date,
		default: moment()
			.startOf('day')
			.toISOString(),
		required: [true, 'Date is required'],
		max: [
			moment()
				.startOf('day')
				.toISOString(),
			'Date should be today or earlier'
		]
	},
	category: {
		type: String,
		required: [true, 'Category required'],
		enum: categories
	},
	amount: {
		type: mongoose.Schema.Types.Decimal,
		required: [true, 'Amount required'],
		validate: {
			validator: v => {
				return v >= 0;
			},
			message: 'Check amount - value cannot be negative'
		}
	},
	desc: {
		type: String,
		required: [true, 'Description required'],
		validate: {
			validator: v => {
				return v.match(businessName);
			},
			message: 'Invalid character used.'
		},
		lowercase: true,
		trim: true
	}
});

expenseSchema.statics.findUsersExpenses = function(userId) {
	return this.find({ userId });
};

const validate = expense => {
	const schema = {
		userId: Joi.string()
			.regex(objectId)
			.required()
			.error(() => 'Invalid user id'),
		date: Joi.date()
			.iso()
			.max('now')
			.required()
			.error(() => 'A date is required, today or earlier'),
		category: Joi.string()
			.required()
			.valid([...categories.values])
			.error(() => 'select a valid category'),
		amount: Joi.number()
			.precision(2)
			.required()
			.min(0.0)
			.error(() => 'Valid amount is required'),
		desc: Joi.string()
			.required()
			.regex(businessName)
			.error(() => 'Valid description is required')
	};
	return Joi.validate(expense, schema);
};

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = { Expense, validate };
