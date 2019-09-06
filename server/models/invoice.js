const moment = require('moment');
const mongoose = require('mongoose');
// const Joi = require('@hapi/joi');
const {
	name,
	businessName,
	simpleEmail,
	phoneNumber,
	postCode,
	sortCode,
	accountNo,
	utr
} = require('../../config/regexps');

const InvoiceSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	// cannot over duplicate invoice number
	// async validator to query invoice numbers in db
	invNo: {
		type: Number,
		required: [true, 'Invoice number is required'],
		async: true,
		validate: {
			validator: async v => {
				const dup = await Invoice.findOne({ invNo: v });
				if (dup) return false;
			},
			message: 'Invoice number already in used.'
		}
	},
	invDate: {
		type: Date,
		default: moment()
			.startOf('day')
			.toISOString(),
		required: [true, 'Date is required'],
		max: [
			moment()
				.startOf('day')
				.toISOString(),
			'Date should be today or earlier'
		]
	},
	emailGreeting: {
		type: String,
		required: [true, 'Greeting for email required'],
		validate: {
			validator: v => {
				return v.match(name);
			},
			message: 'Invalid character used.'
		},
		lowercase: true,
		trim: true
	},
	message: {
		type: String,
		required: [true, 'Message for email required'],
		validate: {
			validator: v => {
				return v.match(name);
			},
			message: 'Invalid character used.'
		},
		lowercase: true,
		trim: true
	},
	paid: {
		type: Boolean,
		default: false,
		required: [true, 'Paid is required'],
		enum: [true, false]
	},
	datePaid: {
		type: Date,
		default: moment()
			.startOf('day')
			.toISOString(),
		max: [
			moment()
				.startOf('day')
				.toISOString(),
			'Date should be today or earlier'
		]
	},
	items: [
		{
			date: {
				type: Date,
				required: [true, 'Date is required'],
				default: moment()
					.startOf('day')
					.toISOString(),
				max: [
					moment()
						.startOf('day')
						.toISOString(),
					'Date should be today or earlier'
				]
			},
			desc: {
				type: String,
				required: [true, 'Item description required'],
				validate: {
					validator: v => {
						return v.match(name);
					},
					message: 'Invalid character used.'
				},
				lowercase: true,
				trim: true
			},
			fee: {
				type: mongoose.Schema.Types.Decimal,
				required: [true, 'Amount required'],
				validate: {
					validator: v => {
						return v >= 0;
					},
					message: 'Check amount - value cannot be negative.'
				}
			}
		}
	],
	client: {
		client_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'clients',
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
	},
	business: {
		business_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'businesses',
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
					return v.match(name);
				},
				message: `contains invalid character`
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
				message: `check phone number`
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
				message: 'incorrect character in address'
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
				message: 'incorrect chatacter in address'
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
		},
		bankName: {
			type: String,
			lowercase: true,
			required: [true, 'Bank name required'],
			validate: {
				validator: v => {
					return v.match(name);
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
					return v.match(sortCode);
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
					return v.match(accountNo);
				},
				message: 'check account number'
			},
			trim: true
		},
		utr: {
			type: String,
			required: [true, 'UTR required'],
			validate: {
				validator: v => {
					return v.match(utr);
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
				message: 'invalid character in terms'
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
				message: 'invalid chatacter in farewell'
			},
			lowercase: true,
			trim: true
		}
	}
});

// const validate = invoice => {
// 	const schema = {

// 	}
// 	return Joi.validate(business,schema);
// }

InvoiceSchema.statics.listInvoiceNumbers = async function() {
	const result = await this.aggregate([
		{ $project: { _id: 1, invNo: 1 } },
		{ $sort: { invNo: 1 } }
	]);
	return result.map(r => r.invNo);
};

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = { Invoice };
