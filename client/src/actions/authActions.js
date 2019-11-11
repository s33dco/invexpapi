import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import setAlert from './alertActions';
import { clearBusiness, getBusiness } from './businessActions';
import { clearClients, getClients } from './clientsActions';
import { clearExpenses, getExpenses } from './expensesActions';
import { clearInvoices, getInvoices } from './invoicesActions';
import {
	USER_LOADED,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	CLEAR_AUTH_ERRORS,
	REFRESH_TOKEN
} from './types';

export const loadUser = () => async dispatch => {
	// load token into global axios headers.
	if (localStorage.token) {
		setAuthToken(localStorage.token);
	}

	try {
		const res = await axios.get(`${process.env.API_URL}/auth`);

		dispatch({
			type: USER_LOADED,
			payload: {
				user:res.data, 
				token: localStorage.token
			}
		});
		await dispatch(getBusiness());
		await dispatch(getClients());
		await dispatch(getExpenses());
		await dispatch(getInvoices());
	} catch (error) {
		dispatch({
			type: AUTH_ERROR,
			payload:
				error.response.data.msg || 'something went wrong - try again',
		});
		await dispatch(logout());
	}
};

export const registerUser = formData => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json',
		},
	};

	try {
		const res = await axios.post(
			`${process.env.API_URL}/users`,
			formData,
			config
		);

		dispatch({
			type: REGISTER_SUCCESS,
			payload: res.data,
		});

		await dispatch(loadUser());
		await dispatch(setAlert('Welcome Aboard!', 'info'));
	} catch (error) {
		dispatch({
			type: REGISTER_FAIL,
			payload:
				error.response.data.msg || 'something went wrong - try again',
		});
	}
};

export const loginUser = formData => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json',
		},
	};

	try {
		const res = await axios.post(
			`${process.env.API_URL}/auth`,
			formData,
			config
		);

		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data,
		});

		await dispatch(loadUser());
		await dispatch(setAlert('Welcome Back!', 'info'));
	} catch (error) {
		dispatch({
			type: LOGIN_FAIL,
			payload:
				error.response.data.msg || 'something went wrong - try again',
		});
	}
};

export const logout = () => async dispatch => {
	dispatch({
		type: LOGOUT,
	});
	await dispatch(clearBusiness());
	await dispatch(clearClients());
	await dispatch(clearExpenses());
	await dispatch(clearInvoices());
	await dispatch(setAlert("you'll need to sign back in.", 'info'));
};

export const clearErrors = () => async dispatch => {
	dispatch({
		type: CLEAR_AUTH_ERRORS,
	});
};

export const refreshToken = () => async (dispatch) => {
	console.log('refreshUser called')
	const config = {
		headers: {
			'Content-type': 'application/json',
		},
	};
	try {
		const res = await axios.post(`${process.env.API_URL}/auth/refresh`, config);
		console.log(res)

		dispatch({
			type: REFRESH_TOKEN,
			payload: res.data
		});

		// await dispatch(loadUser());
		await dispatch(setAlert('Please carry on', 'info'));

	} catch (error) {
		dispatch({
			type: AUTH_ERROR,
			payload:
				error.res.data.msg || 'something went wrong - try again',
		});
	}
}

