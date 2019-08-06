const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	invNo: { type: Number },
	invDate: { type: Date, default: Date.now },
	emailGreeting: { type: String },
	message: { type: String },
	paid: { type: Boolean },
	datePaid: { type: Date },
	items: [
		{
			date: { type: Date, required: true },
			desc: { type: String, required: true },
			fee: { type: mongoose.Schema.Types.Decimal, required: true }
		}
	],
	client: {
		client_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'clients',
			required: true
		},
		cName: { type: String, required: true },
		cPhone: { type: String, required: true },
		cEmail: { type: String, required: true },
		cAdd1: { type: String, required: true },
		cAdd2: { type: String },
		cAdd3: { type: String },
		cPcode: { type: String, required: true }
	},
	business: {
		business_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'businesses',
			required: true
		},
		bName: { type: String, required: true },
		bContact: { type: String, required: true },
		bEmail: { type: String, required: true },
		bPhone: { type: String, required: true },
		bAdd1: { type: String, required: true },
		bAdd2: { type: String },
		bAdd3: { type: String },
		bPcode: { type: String, required: true },
		bankName: { type: String, required: true },
		sortCode: { type: String, required: true },
		accountNo: { type: String, required: true },
		utr: { type: String, required: true },
		terms: { type: String, required: true },
		farewell: { type: String, required: true }
	}
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = { Invoice };
