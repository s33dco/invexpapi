const businessName = /^(([\w-,'!£$%&.()]+)(\s?))+$/;
const checkName = /^(([\w-,'&.()]+)(\s?))+$/;
const checkPhoneNumber = /^(?:\d\s?){9,11}$/;
const checkPostcode = /^[a-zA-Z]{1,2}[0-9][0-9A-Za-z]{0,1} {0,1}[0-9][A-Za-z]{2}$/;
const checkSortcode = /^(\d){2}-(\d){2}-(\d){2}$/;
const checkAccountno = /^(\d){8}$/;
const checkUTR = /^[0-9]{5}\s?[0-9]{5}$/;
const objectId = /^[a-fA-F0-9]{24}$/;
const simpleEmail = /^[^@]+@[^@]+\.[^@]+$/;
const checkPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@£$!%*?&])[A-Za-z\d@£$!%*?&]{8,}$/;
const checkMoney = /^[0-9]+(\.[0-9]{1,2})?$/gm;
const checkNumber = /^[0-9]*$/gm;

module.exports = {
	businessName,
	checkName,
	checkPhoneNumber,
	checkPostcode,
	checkSortcode,
	checkAccountno,
	checkUTR,
	objectId,
	simpleEmail,
	checkPassword,
	checkMoney,
	checkNumber
};
