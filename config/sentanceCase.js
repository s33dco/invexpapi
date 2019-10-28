export default sentanceCase = str => {
	const string = str.replace(/(^\w{1}|\.\s*\w{1})/gi, function(toReplace) {
		return toReplace.toUpperCase();
	});
	return string;
};
