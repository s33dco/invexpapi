const faker = require('faker/locale/en');
const Mongoose = require('mongoose');
const { Business } = require('../../models/business');

const saveBusiness = () => {
	return new Business({
		userId: Mongoose.Types.ObjectId(),
		bName: faker.company.companyName(),
		bEmail: faker.internet.email(),
		bPhone: faker.phone.phoneNumber(),
		bAdd1: faker.address.streetAddress(),
		bAdd2: faker.address.county(),
		bPcode: faker.address.zipCode(),
		bankName: 'fake bank',
		sortcode: '20-21-23',
		accountNo: '89786756',
		utr: '12345678'
	}).save();
};

const unsavedBusiness = () => {
	return new Business({
		userId: Mongoose.Types.ObjectId(),
		bName: faker.companyName(),
		bEmail: faker.internet.email(),
		bPhone: faker.phone.phoneNumber(),
		bAdd1: faker.address.streetAddress(),
		bAdd2: faker.address.county(),
		bPcode: faker.address.zipCode(),
		bankName: faker.companyName(),
		sortcode: '20-21-23',
		accountNo: '89786756',
		utr: '12345678'
	});
};

module.exports = { saveBusiness, unsavedBusiness };
