const faker = require('faker/locale/en');
const { User } = require('../../models/user');

const savedUser = () => {
	return new User({
		name: faker.name.firstName(),
		email: faker.internet.email(),
		password: 'Aval1dPa$$w0rd'
	}).save();
};

const unsavedUser = () => {
	return new User({
		name: faker.name.firstName(),
		email: faker.internet.email(),
		password: 'Aval1dPa$$w0rd'
	});
};

module.exports = { savedUser, unsavedUser };
