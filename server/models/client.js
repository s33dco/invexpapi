const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	cName: {
		type: String,
		required: true,
		minlength: 1,
		lowercase: true,
		trim: true
	},
	cEmail: {
		type: String,
		required: true,
		trim: true
	},
	cPhone: {
		type: String,
		required: true,
		trim: true
	},
	cAdd1: {
		type: String,
		required: true,
		minlength: 1,
		lowercase: true,
		trim: true
	},
	cAdd2: {
		type: String,
		lowercase: true,
		trim: true
	},
	cAdd3: {
		type: String,
		lowercase: true,
		trim: true
	},
	cPcode: {
		type: String,
		required: true,
		minlength: 1,
		uppercase: true,
		trim: true
	}
});

const Client = mongoose.model('Client', clientSchema);

module.exports = { Client };
