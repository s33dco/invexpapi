const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	},
	bName: {
		type: String,
		required: true,
		minlength: 1,
		lowercase: true,
		trim: true
	},
	bEmail: {
		type: String,
		required: true,
		trim: true
	},
	bPhone: {
		type: String,
		required: true,
		trim: true
	},
	bAdd1: {
		type: String,
		required: true,
		minlength: 1,
		lowercase: true,
		trim: true
	},
	bAdd2: {
		type: String,
		lowercase: true,
		trim: true
	},
	bAdd3: {
		type: String,
		lowercase: true,
		trim: true
	},
	bPcode: {
		type: String,
		required: true,
		minlength: 1,
		uppercase: true,
		trim: true
	},
	bankName: {
		type: String,
		lowercase: true,
		required: true,
		trim: true
	},
	sortcode: {
		type: String,
		required: true,
		trim: true
	},
	accountNo: {
		type: String,
		required: true,
		trim: true
	},
	utr: {
		type: String,
		required: true,
		trim: true
	}
});

const Business = mongoose.model('Business', businessSchema);

module.exports = { Business };
