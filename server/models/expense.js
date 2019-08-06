const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	date: {
		type: Date,
		default: Date.now,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	amount: {
		type: mongoose.Schema.Types.Decimal,
		required: true
	},
	desc: {
		type: String,
		required: true
	}
});

// const categories = [
// 	'Office, property and equipment',
// 	'Car, van and travel expenses',
// 	'Clothing expenses',
// 	'Staff expenses',
// 	'Reselling goods',
// 	'Legal and financial costs',
// 	'Mktg, entertainment and subs'
// ];

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = { Expense };
