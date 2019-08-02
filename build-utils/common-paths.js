const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '../');

module.exports = {
	projectRoot: PROJECT_ROOT,
	prodOutput: path.join(PROJECT_ROOT, 'build'),
	devOutput: path.join(PROJECT_ROOT, 'dev'),
	appEntry: path.join(PROJECT_ROOT, 'src')
};
