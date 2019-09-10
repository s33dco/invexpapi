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
	name: {
		type: String,
		required: [true, 'Name required'],
		minlength: 1,
		maxlength: [255, 'Name too long'],
		validate: {
			validator: v => {
				return v.match(businessName);
			},
			message: `Name contains invalid character`
		},
		lowercase: true,
		trim: true
	},
	email: {
		type: String,
		required: [true, 'Email address required'],
		lowercase: true,
		maxlength: [255, 'Email address too long'],
		validate: {
			validator: v => {
				return v.match(simpleEmail);
			},
			message: `Check email address`
		},
		trim: true
	},
	phone: {
		type: String,
		required: [true, 'Phone number required'],
		validate: {
			validator: v => {
				return v.match(phoneNumber);
			},
			message: `Check phone number`
		},
		trim: true
	},
	add1: {
		type: String,
		required: [true, 'First line of address required'],
		validate: {
			validator: v => {
				return v.match(name);
			},
			message: 'incorrect chatacter in address'
		},
		lowercase: true,
		trim: true
	},
	add2: {
		type: String,
		lowercase: true,
		validate: {
			validator: v => {
				return v.match(name);
			},
			message: 'incorrect character in address'
		},
		trim: true
	},
	add3: {
		type: String,
		lowercase: true,
		validate: {
			validator: v => {
				return v.match(name);
			},
			message: 'incorrect character in address'
		},
		trim: true
	},
	postcode: {
		type: String,
		required: [true, 'Postcode required'],
		validate: {
			validator: v => {
				return v.match(postCode);
			},
			message: 'Check postcode'
		},
		uppercase: true,
		trim: true
	}
});

clientSchema.statics.findUsersClients = function(userId) {
	return this.find({ userId });
};

const validate = client => {
	const schema = {
		userId: Joi.string()
			.regex(objectId)
			.required()
			.error(() => 'Invalid user id'),
		name: Joi.string()
			.regex(businessName)
			.min(1)
			.max(255)
			.required()
			.error(() => 'Need Client name for Invoice'),
		email: Joi.string()
			.email({ minDomainSegments: 2 })
			.required()
			.error(() => 'email must be a valid address'),
		phone: Joi.string()
			.required()
			.regex(phoneNumber)
			.error(() => 'Invalid phone number - just digits'),
		add1: Joi.string()
			.required()
			.regex(name)
			.error(() => 'first line of address required, just word characters.'),
		add2: Joi.string()
			.regex(name)
			.error(() => 'just word characters.'),
		add3: Joi.string()
			.regex(name)
			.error(() => 'just word characters.'),
		postcode: Joi.string()
			.required()
			.regex(postCode)
			.error(() => 'enter a valid postcode')
	};
	return Joi.validate(client, schema);
};

const Client = mongoose.model('Client', clientSchema);

module.exports = { Client, validate };
