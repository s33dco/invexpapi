import axios from 'axios';

const setAuthToken = token => {
	if (token) {
		// if token set as axios default headers
		axios.defaults.headers.common['X-AUTH-TOKEN'] = token;
	} else {
		delete axios.defaults.headers.common['X-AUTH-TOKEN'];
	}
};
export default setAuthToken;
