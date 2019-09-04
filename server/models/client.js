const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const {
	businessName,
	name,
	phoneNumber,
	postCode,
	objectId,
	simpleEmail
} = require('../../config/regexps');

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
		maxlength: 255,
		validate: {
			validator: v => {
				return v.match(businessName);
			}
		},
		lowercase: true,
		trim: true
	},
	cEmail: {
		type: String,
		required: true,
		lowercase: true,
		minlength: 1,
		maxlength: 255,
		validate: {
			validator: v => {
				return v.match(simpleEmail);
			}
		},
		trim: true
	},
	cPhone: {
		type: String,
		required: true,
		minlength: 11,
		validate: {
			validator: v => {
				return v.match(phoneNumber);
			}
		},
		trim: true
	},
	cAdd1: {
		type: String,
		required: true,
		validate: {
			validator: v => {
				return v.match(name);
			}
		},
		lowercase: true,
		trim: true
	},
	cAdd2: {
		type: String,
		lowercase: true,
		validate: {
			validator: v => {
				return v.match(name);
			}
		},
		trim: true
	},
	cAdd3: {
		type: String,
		lowercase: true,
		validate: {
			validator: v => {
				return v.match(name);
			}
		},
		trim: true
	},
	cPcode: {
		type: String,
		required: true,
		validate: {
			validator: v => {
				return v.match(postCode);
			}
		},
		uppercase: true,
		trim: true
	}
});

const validate = client => {
	const schema = {
		userID: Joi.string()
			.regex(objectId)
			.required()
			.error(() => 'Invalid user id'),
		cName: Joi.string()
			.regex(businessName)
			.min(1)
			.max(255)
			.required()
			.error(() => 'Need Client name for Invoice'),
		cEmail: Joi.string()
			.email({ minDomainSegments: 2 })
			.required()
			.error(() => 'email must be a valid address'),
		cPhone: Joi.string()
			.required()
			.regex(phoneNumber)
			.error(() => 'Invalid phone number - just digits'),
		cAdd1: Joi.string()
			.required()
			.regex(name)
			.error(() => 'first line of address required, just word characters.'),
		cAdd2: Joi.string()
			.regex(name)
			.error(() => 'just word characters.'),
		cAdd3: Joi.string()
			.regex(name)
			.error(() => 'just word characters.'),
		cPcode: Joi.string()
			.required()
			.regex(postCode)
			.error(() => 'enter a valid postcode')
	};
	return Joi.validate(client, schema);
};

const Client = mongoose.model('Client', clientSchema);

module.exports = { Client, validate };
