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
		invDate: moment().format(),
		emailGreeting: 'Dear Frank',
		message: 'look forward to next time',
		paid: false,
		items: [
			{
				date: moment()
					.subtract(3, 'days')
					.format(),
				desc: 'built a shed',
				fee: 123.45
			}
		],
		client: {
			client_id: client._id,
			cName: client.cName,
			cPhone: client.cPhone,
			cEmail: client.cEmail,
			cAdd1: client.cAdd1,
			cAdd2: client.cAdd2,
			cAdd3: client.cAdd3,
			cPcode: client.cPcode
		},
		business: {
			business_id: business._id,
			bName: business.bName,
			bContact: business.bContact,
			bEmail: business.bEmail,
			bPhone: business.bPhone,
			bAdd1: business.bAdd1,
			bAdd2: business.bAdd2,
			bAdd3: business.bAdd3,
			bPcode: business.bPcode,
			bankName: business.bankName,
			sortCode: business.sortCode,
			accountNo: business.accountNo,
			utr: business.utr,
			terms: business.terms,
			farewell: business.farewell
		}
	}).save();
};

module.exports = { savedOwedInvoice };
