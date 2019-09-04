const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const {
	businessName,
	name,
	phoneNumber,
	postCode,
	sortCode,
	accountNo,
	utr,
	objectId,
	simpleEmail
} = require('../../config/regexps');

const businessSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	useMileage: {
		type: Boolean,
		required: true
	},
	bName: {
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
	bContact: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 255,
		validate: {
			validator: v => {
				return v.match(name);
			}
		},
		lowercase: true,
		trim: true
	},
	bEmail: {
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
	bPhone: {
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
	bAdd1: {
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
	bAdd2: {
		type: String,
		lowercase: true,
		validate: {
			validator: v => {
				return v.match(name);
			}
		},
		trim: true
	},
	bAdd3: {
		type: String,
		lowercase: true,
		validate: {
			validator: v => {
				return v.match(name);
			}
		},
		trim: true
	},
	bPcode: {
		type: String,
		required: true,
		validate: {
			validator: v => {
				return v.match(postCode);
			}
		},
		uppercase: true,
		trim: true
	},
	bankName: {
		type: String,
		lowercase: true,
		required: true,
		validate: {
			validator: v => {
				return v.match(name);
			}
		},
		trim: true
	},
	sortCode: {
		type: String,
		required: true,
		validate: {
			validator: v => {
				return v.match(sortCode);
			}
		},
		trim: true
	},
	accountNo: {
		type: String,
		required: true,
		validate: {
			validator: v => {
				return v.match(accountNo);
			}
		},
		trim: true
	},
	utr: {
		type: String,
		required: true,
		validate: {
			validator: v => {
				return v.match(utr);
			}
		},
		trim: true
	},
	terms: {
		type: String,
		required: true,
		minlength: 1,
		lowercase: true,
		validate: {
			validator: v => {
				return v.match(businessName);
			}
		},
		trim: true
	},
	farewell: {
		type: String,
		required: true,
		validate: {
			validator: v => {
				return v.match(businessName);
			}
		},
		lowercase: true,
		trim: true
	}
});

const validate = business => {
	const schema = {
		userID: Joi.string()
			.regex(objectId)
			.required()
			.error(() => 'Invalid user id'),
		useMileage: Joi.boolean()
			.required()
			.error(() => 'Yes or no for simplified mileage'),
		bName: Joi.string()
			.regex(businessName)
			.min(1)
			.max(255)
			.required()
			.error(() => 'Need Business name for Invoice'),
		bContact: Joi.string()
			.regex(name)
			.min(1)
			.max(255)
			.required()
			.error(() => 'Need a contact name for Invoice'),
		bEmail: Joi.string()
			.email({ minDomainSegments: 2 })
			.required()
			.error(() => 'email must be a valid address'),
		bPhone: Joi.string()
			.required()
			.regex(phoneNumber)
			.error(() => 'Invalid phone number - just digits'),
		bAdd1: Joi.string()
			.required()
			.regex(name)
			.error(() => 'first line of address required, just word characters.'),
		bAdd2: Joi.string()
			.regex(name)
			.error(() => 'just word characters.'),
		bAdd3: Joi.string()
			.regex(name)
			.error(() => 'just word characters.'),
		bPcode: Joi.string()
			.required()
			.regex(postCode)
			.error(() => 'enter a valid postcode'),
		bankName: Joi.string()
			.required()
			.regex(name)
			.error(() => 'Enter the name of your bank'),
		sortCode: Joi.string()
			.required()
			.regex(sortCode)
			.error(() => 'sort code format XX-XX-XX only'),
		accountNo: Joi.string()
			.required()
			.regex(accountNo)
			.error(() => 'account number 8 digits only'),
		utr: Joi.string()
			.regex(utr)
			.required()
			.error(() => 'tax reference digits only'),
		terms: Joi.string()
			.required()
			.regex(businessName)
			.error(() => 'enter your terms - just regular characters'),
		farewell: Joi.string()
			.required()
			.regex(businessName)
			.error(() => 'just words')
	};
	return Joi.validate(business, schema);
};

const Business = mongoose.model('Business', businessSchema);

module.exports = { Business, validate };
