const titleCase = phrase => {
	return phrase
		.toLowerCase()
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

const sentanceCase = str => {
	const string = str.replace(/(^\w{1}|\.\s*\w{1})/gi, function(toReplace) {
		return toReplace.toUpperCase();
	});
	return string;
};

module.exports = { sentanceCase, titleCase };
