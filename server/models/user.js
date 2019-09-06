const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { name, password, simpleEmail } = require('../../config/regexps');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name required'],
		minlength: 1,
		maxlength: [32, 'Name too long'],
		validate: {
			validator: v => {
				return v.match(name);
			},
			message: `Name contains blacklisted character`
		},
		trim: true
	},
	email: {
		type: String,
		required: [true, 'Email address required'],
		minlength: 1,
		maxlength: [255, 'Email address too long'],
		validate: {
			validator: v => {
				return v.match(simpleEmail);
			},
			message: `Check email address`
		},
		lowercase: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	}
});

const validate = user => {
	const schema = {
		name: Joi.string()
			.max(32)
			.regex(name)
			.required()
			.error(() => 'name should be 1-32 letters'),

		email: Joi.string()
			.email({ minDomainSegments: 2 })
			.error(() => 'email must be a valid address'),
		password: Joi.string()
			.min(8)
			.max(50)
			.regex(password)
			.required()
			.error(
				() =>
					'password requires atleast one uppercase & lowercase letter, one number & one special character (@£$!%*?&), between 8 and 50 characters long'
			)
	};
	return Joi.validate(user, schema);
};

const validateLogin = user => {
	const loginSchema = {
		email: Joi.string()
			.email({ minDomainSegments: 2 })
			.error(() => 'email must be a valid address'),
		password: Joi.string()
			.min(8)
			.max(255)
			.regex(password)
			.required()
			.error(
				() =>
					'password requires atleast one uppercase & lowercase letter, one number & one special character (@£$!%*?&), between 8 and 255 characters long'
			)
	};

	return Joi.validate(user, loginSchema);
};

const User = mongoose.model('User', userSchema);

module.exports = { User, validate, validateLogin };
