const faker = require('faker/locale/en');
const mongoose = require('mongoose');
const { Client } = require('../../models/client');

const savedClient = () => {
	return new Client({
		userId: mongoose.Types.ObjectId(),
		cName: faker.company.companyName(),
		cPhone: faker.phone.phoneNumber(),
		cEmail: faker.internet.email(),
		cAdd1: faker.address.streetAddress(),
		cAdd2: faker.address.county(),
		cPcode: faker.address.zipCode()
	}).save();
};

const unsavedClient = () => {
	return new Client({
		userId: mongoose.Types.ObjectId(),
		cName: faker.company.companyName(),
		cPhone: faker.phone.phoneNumber(),
		cEmail: faker.internet.email(),
		cAdd1: faker.address.streetAddress(),
		cAdd2: faker.address.county(),
		cPcode: faker.address.zipCode()
	});
};

module.exports = { savedClient, unsavedClient };
