const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const {
	businessName,
	checkName,
	checkPhoneNumber,
	checkPostcode,
	objectId,
	simpleEmail
} = require('../../config/regexps');

const clientSchema = new mongoose.Schema(
	{
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
					return v.match(checkPhoneNumber);
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
					return v.match(checkName);
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
					return v.match(checkName);
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
					return v.match(checkName);
				},
				message: 'incorrect character in address'
			},
			trim: true
		},
		postCode: {
			type: String,
			required: [true, 'Postcode required'],
			validate: {
				validator: v => {
					return v.match(checkPostcode);
				},
				message: 'Check postcode'
			},
			uppercase: true,
			trim: true
		},
		greeting: {
			type: String,
			lowercase: true,
			required: [true, 'A greeting is required for emails'],
			validate: {
				validator: v => {
					return v.match(businessName);
				},
				message: 'incorrect character in greeting'
			},
			uppercase: true,
			trim: true
		}
	},
	{
		toObject: {
			transform: function(doc, ret) {
				delete ret.userId;
				delete ret.__v;
			}
		}
	}
);

clientSchema.statics.UsersClientsAlphabetically = function(userId) {
	return this.find({ userId }).sort({ name: 1 });
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
			.error(() => 'Valid Client name required'),
		email: Joi.string()
			.email({ minDomainSegments: 2 })
			.required()
			.error(() => 'Valid email address required'),
		phone: Joi.string()
			.required()
			.regex(checkPhoneNumber)
			.error(() => 'Valid phone number required - just digits'),
		add1: Joi.string()
			.required()
			.regex(checkName)
			.error(
				() => 'Valid first line of address required, just word characters'
			),
		add2: Joi.string()
			.regex(checkName)
			.error(() => 'Check second line of address - just word characters'),
		add3: Joi.string()
			.regex(checkName)
			.error(() => 'Check third line of address - just word characters'),
		postCode: Joi.string()
			.required()
			.regex(checkPostcode)
			.error(() => 'Valid postcode required'),
		greeting: Joi.string()
			.required()
			.regex(businessName)
			.error(() => 'Invalid character in greeting')
	};
	return Joi.validate(client, schema);
};

const Client = mongoose.model('Client', clientSchema);

module.exports = { Client, validate };
