const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const {
	businessName,
	checkName,
	checkPhoneNumber,
	checkPostcode,
	checkSortcode,
	checkAccountno,
	checkUTR,
	objectId,
	simpleEmail
} = require('../../config/regexps');

const businessSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users',
			required: true
		},
		useMileage: {
			type: Boolean,
			required: true
		},
		name: {
			type: String,
			required: [true, 'Business Name required'],
			maxlength: [255, 'Business Name too long'],
			validate: {
				validator: v => {
					return v.match(businessName);
				},
				message: `contains blacklisted character`
			},
			lowercase: true,
			trim: true
		},
		contact: {
			type: String,
			required: [true, 'Contact Name required'],
			maxlength: [255, 'Contact Name too long'],
			validate: {
				validator: v => {
					return v.match(checkName);
				},
				message: `contains blacklisted character`
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
				message: `check phone number`
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
				message: 'incorrect chatacter in address'
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
				message: 'incorrect chatacter in address'
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
				message: 'check postcode'
			},
			uppercase: true,
			trim: true
		},
		bankName: {
			type: String,
			lowercase: true,
			required: [true, 'Bank name required'],
			validate: {
				validator: v => {
					return v.match(checkName);
				},
				message: 'incorrect chatacter in Bank name'
			},
			trim: true
		},
		sortCode: {
			type: String,
			required: [true, 'Sort code required'],
			validate: {
				validator: v => {
					return v.match(checkSortcode);
				},
				message: 'check sort code'
			},
			trim: true
		},
		accountNo: {
			type: String,
			required: [true, 'Account number required'],
			validate: {
				validator: v => {
					return v.match(checkAccountno);
				},
				message: 'check account nummber'
			},
			trim: true
		},
		utr: {
			type: String,
			required: [true, 'UTR required'],
			validate: {
				validator: v => {
					return v.match(checkUTR);
				},
				message: 'check UTR'
			},
			trim: true
		},
		terms: {
			type: String,
			required: [true, 'payment terms required'],
			minlength: 1,
			lowercase: true,
			validate: {
				validator: v => {
					return v.match(businessName);
				},
				message: 'incorrect chatacter in terms'
			},
			trim: true
		},
		farewell: {
			type: String,
			required: [true, 'farewell required'],
			validate: {
				validator: v => {
					return v.match(businessName);
				},
				message: 'incorrect chatacter in farewell'
			},
			lowercase: true,
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

businessSchema.statics.findUsersBusiness = function(userId) {
	return this.findOne({ userId });
};

const validate = business => {
	const schema = {
		userId: Joi.string()
			.regex(objectId)
			.required()
			.error(() => 'Invalid user id'),
		useMileage: Joi.boolean()
			.required()
			.error(() => 'Yes or no for simplified mileage'),
		name: Joi.string()
			.regex(businessName)
			.min(1)
			.max(255)
			.required()
			.error(() => 'Valid Business name required'),
		contact: Joi.string()
			.regex(checkName)
			.min(1)
			.max(255)
			.required()
			.error(() => 'Valid contact name required'),
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
		bankName: Joi.string()
			.required()
			.regex(checkName)
			.error(() => 'Valid bank name required'),
		sortCode: Joi.string()
			.required()
			.regex(checkSortcode)
			.error(() => 'Valid sort code required (XX-XX-XX)'),
		accountNo: Joi.string()
			.required()
			.regex(checkAccountno)
			.error(() => 'Valid account number required - 8 digits only'),
		utr: Joi.string()
			.regex(checkUTR)
			.required()
			.error(() => 'Valid tax reference required'),
		terms: Joi.string()
			.required()
			.regex(businessName)
			.error(() => 'enter your terms - just regular characters'),
		farewell: Joi.string()
			.required()
			.regex(businessName)
			.error(() => 'enter your farewell - just regular characters')
	};
	return Joi.validate(business, schema);
};

const Business = mongoose.model('Business', businessSchema);

module.exports = { Business, validate };
