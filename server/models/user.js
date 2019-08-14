const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 20,
		trim: true
	},
	email: {
		type: String,
		required: true,
		minlength: 6,
		trim: true
	},
	password: {
		type: String,
		require: true,
		minlength: 8,
		maxlength: 255
	}
});

const validate = user => {
	const schema = {
		name: Joi.string()
			.min(1)
			.max(20)
			.regex(/^[a-zA-Z]+(?:[\s.]+[a-zA-Z]+)*$/)
			.required()
			.error(() => 'name should be 1-20 letters'),

		email: Joi.string()
			.email({ minDomainSegments: 2 })
			.error(() => 'email must be a valid address'),
		password: Joi.string()
			.min(8)
			.max(255)
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@£$!%*?&])[A-Za-z\d@£$!%*?&]{8,}$/
			)
			.required()
			.error(
				() =>
					'password requires atleast one uppercase & lowercase letter, one number & one special character (@£$!%*?&), between 8 and 255 characters long'
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
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@£$!%*?&])[A-Za-z\d@£$!%*?&]{8,}$/
			)
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
