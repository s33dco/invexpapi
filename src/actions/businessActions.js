import axios from 'axios';
import { setAlert } from './alertActions';
import {
	GET_BUSINESS,
	ADD_BUSINESS,
	UPDATE_BUSINESS,
	BUSINESS_ERROR,
	CLEAR_BUSINESS,
	CLEAR_BUSINESS_ERROR
} from './types';

export const clearBusiness = () => async dispatch => {
	dispatch({
		type: CLEAR_BUSINESS
	});
	await dispatch(setAlert('business cleared', 'warn'));
};

export const clearBusinessErrors = () => async dispatch => {
	dispatch({
		type: CLEAR_BUSINESS_ERROR
	});
};

export const getBusiness = () => async dispatch => {
	try {
		const res = await axios.get(`${process.env.API_URL}/businesses`);
		dispatch({
			type: GET_BUSINESS,
			payload: res.data
		});
		// }
	} catch (error) {
		dispatch({
			type: BUSINESS_ERROR,
			payload: error.response.data.msg
		});
		await dispatch(setAlert(error.response.data.msg, 'warn'));
		await dispatch(clearBusinessErrors());
	}
};

export const addBusiness = formData => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};

	try {
		const res = await axios.post(
			`${process.env.API_URL}/businesses`,
			formData,
			config
		);

		dispatch({
			type: ADD_BUSINESS,
			payload: res.data
		});

		await dispatch(setAlert('Business Details Added!', 'info'));
	} catch (error) {
		dispatch({
			type: BUSINESS_ERROR,
			payload: error.response.data.msg
		});
	}
};

export const updateBusiness = (id, formData) => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};

	try {
		const res = await axios.put(
			`${process.env.API_URL}/businesses/${id}`,
			formData,
			config
		);

		dispatch({
			type: UPDATE_BUSINESS,
			payload: res.data
		});
		await dispatch(setAlert('Business Details Updated!', 'info'));
	} catch (error) {
		dispatch({
			type: BUSINESS_ERROR,
			payload: error.response.data.msg
		});
	}
};
