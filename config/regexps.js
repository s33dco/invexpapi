const businessName = /^(([\w-,'!£$%&.()]+)(\s?))+$/;
const checkName = /^(([\w-,'&.()]+)(\s?))+$/;
const phoneNumber = /^(?:\d\s?){9,11}$/;
const postCode = /^[a-zA-Z]{1,2}[0-9][0-9A-Za-z]{0,1} {0,1}[0-9][A-Za-z]{2}$/;
const sortCode = /^(\d){2}-(\d){2}-(\d){2}$/;
const accountNo = /^(\d){8}$/;
const utr = /^[0-9]{5}\s?[0-9]{5}$/;
const objectId = /^[a-fA-F0-9]{24}$/;
const simpleEmail = /^[^@]+@[^@]+\.[^@]+$/;
const checkPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@£$!%*?&])[A-Za-z\d@£$!%*?&]{8,}$/;

module.exports = {
	businessName,
	checkName,
	phoneNumber,
	postCode,
	sortCode,
	accountNo,
	utr,
	objectId,
	simpleEmail,
	checkPassword
};
