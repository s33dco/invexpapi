const faker = require('faker/locale/en');
const mongoose = require('mongoose');
const { Business } = require('../../models/business');

const savedBusiness = () => {
	return new Business({
		userId: mongoose.Types.ObjectId(),
		useMileage: true,
		name: faker.company.companyName(),
		contact: faker.company.companyName(),
		email: faker.internet.email(),
		phone: '07968 123456',
		add1: faker.address.streetAddress(),
		add2: faker.address.county(),
		postcode: 'TW17 8hj',
		bankName: 'fake bank',
		sortCode: '20-21-23',
		accountNo: '89786756',
		utr: '12345 67890',
		terms: 'paid in full',
		farewell: 'see you later'
	}).save();
};

const unsavedBusiness = () => {
	return new Business({
		userId: mongoose.Types.ObjectId(),
		useMileage: true,
		name: faker.company.companyName(),
		contact: faker.company.companyName(),
		email: faker.internet.email(),
		phone: '01272 678678',
		add1: faker.address.streetAddress(),
		add2: faker.address.county(),
		postcode: 'WC1A 1AX',
		bankName: 'fake bank',
		sortCode: '20-21-23',
		accountNo: '89786756',
		utr: '1234567890',
		terms: 'paid in full',
		farewell: 'see you later'
	});
};

module.exports = { savedBusiness, unsavedBusiness };
