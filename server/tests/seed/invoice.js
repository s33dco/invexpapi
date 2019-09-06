const moment = require('moment');
const { savedBusiness } = require('../seed/business');
const { savedUser } = require('./user');
const { savedClient } = require('./client');
const { Invoice } = require('../../models/invoice');

const savedOwedInvoice = async () => {
	const user = await savedUser();
	const business = await savedBusiness();
	const client = await savedClient();

	return new Invoice({
		userId: user._id,
		invNo: 1,
		invDate: moment()
			.startOf('day')
			.toISOString(),
		emailGreeting: 'Dear Frank',
		message: 'look forward to next time',
		paid: false,
		items: [
			{
				date: moment()
					.subtract(3, 'days')
					.startOf('day')
					.toISOString(),
				desc: 'built a shed',
				fee: 123.45
			}
		],
		client: {
			client_id: client._id,
			name: client.name,
			phone: client.phone,
			email: client.email,
			add1: client.add1,
			add2: client.add2,
			add3: client.add3,
			postcode: client.postcode
		},
		business: {
			business_id: business._id,
			name: business.name,
			contact: business.contact,
			email: business.email,
			phone: business.phone,
			add1: business.add1,
			add2: business.add2,
			add3: business.add3,
			postcode: business.postcode,
			bankName: business.bankName,
			sortCode: business.sortCode,
			accountNo: business.accountNo,
			utr: business.utr,
			terms: business.terms,
			farewell: business.farewell
		}
	}).save();
};

const unsavedOwedInvoice = async () => {
	const user = await savedUser();
	const business = await savedBusiness();
	const client = await savedClient();

	return new Invoice({
		userId: user._id,
		invNo: 2,
		invDate: moment()
			.startOf('day')
			.toISOString(),
		emailGreeting: 'Dear Frank',
		message: 'look forward to next time',
		paid: false,
		items: [
			{
				date: moment()
					.subtract(3, 'days')
					.startOf('day')
					.toISOString(),
				desc: 'built a shed',
				fee: 123.45
			}
		],
		client: {
			client_id: client._id,
			name: client.name,
			phone: client.phone,
			email: client.email,
			add1: client.add1,
			add2: client.add2,
			add3: client.add3,
			postcode: client.postcode
		},
		business: {
			business_id: business._id,
			name: business.name,
			contact: business.contact,
			email: business.email,
			phone: business.phone,
			add1: business.add1,
			add2: business.add2,
			add3: business.add3,
			postcode: business.postcode,
			bankName: business.bankName,
			sortCode: business.sortCode,
			accountNo: business.accountNo,
			utr: business.utr,
			terms: business.terms,
			farewell: business.farewell
		}
	});
};

const savedPaidInvoice = async () => {
	const user = await savedUser();
	const business = await savedBusiness();
	const client = await savedClient();

	return new Invoice({
		userId: user._id,
		invNo: 3,
		invDate: moment()
			.startOf('day')
			.toISOString(),
		emailGreeting: 'Dear Frank',
		message: 'look forward to next time',
		paid: true,
		datePaid: moment()
			.startOf('day')
			.toISOString(),
		items: [
			{
				date: moment()
					.subtract(3, 'days')
					.startOf('day')
					.toISOString(),
				desc: 'built a shed',
				fee: 123.45
			}
		],
		client: {
			client_id: client._id,
			name: client.name,
			phone: client.phone,
			email: client.email,
			add1: client.add1,
			add2: client.add2,
			add3: client.add3,
			postcode: client.postcode
		},
		business: {
			business_id: business._id,
			name: business.name,
			contact: business.contact,
			email: business.email,
			phone: business.phone,
			add1: business.add1,
			add2: business.add2,
			add3: business.add3,
			postcode: business.postcode,
			bankName: business.bankName,
			sortCode: business.sortCode,
			accountNo: business.accountNo,
			utr: business.utr,
			terms: business.terms,
			farewell: business.farewell
		}
	}).save();
};

module.exports = { savedOwedInvoice, unsavedOwedInvoice, savedPaidInvoice };
