const moment = require('moment');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const {
	checkName,
	businessName,
	simpleEmail,
	phoneNumber,
	postCode,
	sortCode,
	accountNo,
	utr
} = require('../../config/regexps');

const invoiceSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users',
			required: true
		},
		invNo: {
			type: Number,
			required: [true, 'Invoice number is required']
		},
		date: {
			type: Date,
			default: moment().utc(),
			required: [true, 'Date is required'],
			max: [
				moment()
					.utc()
					.endOf('day'),
				'Date should be today or earlier'
			]
		},
		mileage: {
			type: Number,
			trim: true
		},
		message: {
			type: String,
			required: [true, 'Message for email required'],
			validate: {
				validator: v => {
					return v.match(checkName);
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
			max: [
				moment()
					.utc()
					.endOf('day'),
				'Date should be today or earlier'
			]
		},
		total: {
			type: mongoose.Schema.Types.Decimal,
			required: [true, 'Invoice Total required'],
			validate: {
				validator: v => {
					return v >= 0;
				},
				message: 'Check Total - value cannot be negative.'
			}
		},
		emailSent: {
			type: Date,
			max: [
				moment()
					.utc()
					.endOf('day'),
				'Date should be today or earlier'
			]
		},

		items: [
			{
				date: {
					type: Date,
					required: [true, 'Date is required'],
					default: moment().utc(),
					max: [
						moment()
							.utc()
							.endOf('day'),
						'Date should be today or earlier'
					]
				},
				desc: {
					type: String,
					required: [true, 'Item description required'],
					validate: {
						validator: v => {
							return v.match(checkName);
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
				},
				id: {
					type: String,
					required: [true, 'id required']
				}
			}
		],
		client: {
			_id: {
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
						return v.match(postCode);
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
		business: {
			_id: {
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
						return v.match(checkName);
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
						return v.match(checkName);
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
					message: 'incorrect chatacter in address'
				},
				trim: true
			},
			postCode: {
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
			},
			useMileage: {
				type: Boolean,
				required: true
			}
		}
	},
	{
		toObject: {
			transform: function(doc, ret) {
				delete ret.userId;
				delete ret.__v;
				ret.total = ret.total.toString();
				ret.items.forEach(item => {
					item.fee = item.fee.toString();
					delete item._id;
				});
			}
		},
		toJSON: {
			transform: function(doc, ret) {
				delete ret.userId;
				delete ret.__v;
				ret.items.forEach(item => {
					item.fee = item.fee.toString();
					delete item._id;
				});
				ret.total = ret.total.toString();
			}
		}
	}
);

invoiceSchema.statics.findUsersInvoicesByNumber = function(userId) {
	return this.find({ userId }).sort({ invNo: 1 });
};

invoiceSchema.path('items').validate(v => {
	if (v.length < 1) {
		throw new Error('Atleast one invoice item required');
	}
});

// invoiceSchema.path('invNo').validate(async v => {
// 	const dupe = await Invoice.find({ invNo: v });
// 	if (dupe) {
// 		throw new Error('Invoice number already used');
// 	}
// });

const validate = invoice => {
	const schema = {
		userId: Joi.objectId()
			.required()
			.error(() => 'Invalid user id for invoice'),
		invNo: Joi.number().required(),
		date: Joi.date()
			.iso()
			.max('now')
			.required()
			.error(() => 'A date is required, today or earlier'),

		mileage: Joi.number(),
		message: Joi.string()
			.required()
			.regex(businessName)
			.error(() => 'enter your farewell - just regular characters'),
		paid: Joi.boolean().required(),
		total: Joi.number()
			.precision(2)
			.required()
			.error(
				() =>
					'the invoice total is not being supplied, please contact your administrator'
			),
		datePaid: Joi.date()
			.iso()
			.max('now')
			.error(() => 'A date is required, today or earlier'),
		emailSent: Joi.date()
			.iso()
			.max('now')
			.error(() => 'A date is required, today or earlier'),
		items: Joi.array()
			.items(
				Joi.object().keys({
					date: Joi.date()
						.iso()
						.max('now')
						.required()
						.error(
							() => 'A date is required for the invoice item, today or earlier'
						),
					desc: Joi.string()
						.required()
						.regex(businessName)
						.error(() => 'Description needed for invoice item'),
					fee: Joi.number()
						.precision(2)
						.required()
						.error(() => 'The fee for the invoice item looks wrong'),
					id: Joi.string().required()
				})
			)
			.required()
			.error(() => 'Invoice items are required'),
		client: Joi.object()
			.required()
			.error(
				() => 'Check the client details, try again or contact the administrator'
			),
		business: Joi.object()
			.required()
			.error(
				() =>
					'There is a problem with your business details, try again or contact the administrator'
			)
	};
	return Joi.validate(invoice, schema);
};

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = { Invoice, validate };
