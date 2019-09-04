const faker = require('faker/locale/en');
const mongoose = require('mongoose');
const { Client } = require('../../models/client');

const savedClient = () => {
	return new Client({
		userId: mongoose.Types.ObjectId(),
		cName: faker.company.companyName(),
		cPhone: '0121 456 7894',
		cEmail: faker.internet.email(),
		cAdd1: faker.address.streetAddress(),
		cAdd2: faker.address.county(),
		cPcode: 'bn3 8gh'
	}).save();
};

const unsavedClient = () => {
	return new Client({
		userId: mongoose.Types.ObjectId(),
		cName: faker.company.companyName(),
		cPhone: '07777 765432',
		cEmail: faker.internet.email(),
		cAdd1: faker.address.streetAddress(),
		cAdd2: faker.address.county(),
		cPcode: 'wc1a 7hg'
	});
};

module.exports = { savedClient, unsavedClient };
