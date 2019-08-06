const faker = require('faker/locale/en');
const mongoose = require('mongoose');
const { Business } = require('../../models/business');

const savedBusiness = () => {
	return new Business({
		userId: mongoose.Types.ObjectId(),
		bName: faker.company.companyName(),
		bContact: faker.company.companyName(),
		bEmail: faker.internet.email(),
		bPhone: faker.phone.phoneNumber(),
		bAdd1: faker.address.streetAddress(),
		bAdd2: faker.address.county(),
		bPcode: faker.address.zipCode(),
		bankName: 'fake bank',
		sortCode: '20-21-23',
		accountNo: '89786756',
		utr: '12345678',
		terms: 'paid in full',
		farewell: 'see you later'
	}).save();
};

const unsavedBusiness = () => {
	return new Business({
		userId: mongoose.Types.ObjectId(),
		bName: faker.company.companyName(),
		bContact: faker.company.companyName(),
		bEmail: faker.internet.email(),
		bPhone: faker.phone.phoneNumber(),
		bAdd1: faker.address.streetAddress(),
		bAdd2: faker.address.county(),
		bPcode: faker.address.zipCode(),
		bankName: 'fake bank',
		sortCode: '20-21-23',
		accountNo: '89786756',
		utr: '12345678',
		terms: 'paid in full',
		farewell: 'see you later'
	});
};

module.exports = { savedBusiness, unsavedBusiness };
