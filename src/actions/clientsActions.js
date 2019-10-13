import axios from 'axios';
import { setAlert } from './alertActions';
import {
	GET_CLIENTS,
	ADD_CLIENT,
	UPDATE_CLIENT,
	DELETE_CLIENT,
	CLIENT_ERROR,
	CLEAR_CLIENTS,
	CLEAR_CLIENT_ERRORS,
	SET_CURRENT_CLIENT,
	CLEAR_CURRENT_CLIENT,
	SET_DELETE_CLIENT,
	CLEAR_DELETE_CLIENT,
	GET_CLIENT_ITEMS,
	CLEAR_CLIENT_ITEMS
} from './types';
import { clearInvoices } from './invoicesActions';

export const clearClients = () => async dispatch => {
	dispatch({
		type: CLEAR_CLIENTS
	});
	await dispatch(setAlert('Clients cleared', 'warn'));
};

export const clearClientErrors = () => async dispatch => {
	dispatch({
		type: CLEAR_CLIENT_ERRORS
	});
};

export const setCurrentClient = client => async dispatch => {
	dispatch({
		type: SET_CURRENT_CLIENT,
		payload: client
	});
};

export const clearCurrentClient = () => async dispatch => {
	dispatch({
		type: CLEAR_CURRENT_CLIENT
	});
};

export const setDeleteClient = client => async dispatch => {
	dispatch({
		type: SET_DELETE_CLIENT,
		payload: client
	});
};

export const clearDeleteClient = () => async dispatch => {
	dispatch({
		type: CLEAR_DELETE_CLIENT
	});
};

export const getClients = () => async dispatch => {
	try {
		const res = await axios.get(`${process.env.API_URL}/clients`);
		dispatch({
			type: GET_CLIENTS,
			payload: res.data
		});
	} catch (error) {
		dispatch({
			type: CLIENT_ERROR,
			payload: error.response.data.msg
		});
		await dispatch(setAlert(error.response.data.msg, 'warn'));
		await dispatch(clearClientErrors());
	}
};

export const addClient = formData => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};

	try {
		const res = await axios.post(
			`${process.env.API_URL}/clients`,
			formData,
			config
		);

		dispatch({
			type: ADD_CLIENT,
			payload: res.data
		});

		await dispatch(setAlert('Client Created!', 'info'));
	} catch (error) {
		dispatch({
			type: CLIENT_ERROR,
			payload: error.response.data.msg || 'something went wrong - try again'
		});
	}
};

export const updateClient = (id, formData) => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};

	try {
		const res = await axios.put(
			`${process.env.API_URL}/clients/${id}`,
			formData,
			config
		);

		dispatch({
			type: UPDATE_CLIENT,
			payload: res.data
		});
		await dispatch(setAlert(`${res.data.name} Updated!`, 'info'));
	} catch (error) {
		dispatch({
			type: CLIENT_ERROR,
			payload: error.response.data.msg || 'something went wrong - try again'
		});
	}
};

export const deleteClient = id => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};

	try {
		const res = await axios.delete(
			`${process.env.API_URL}/clients/${id}`,
			config
		);

		dispatch({
			type: DELETE_CLIENT,
			payload: id
		});

		await dispatch(setAlert(res.data.msg, 'info'));
	} catch (error) {
		dispatch({
			type: CLIENT_ERROR,
			payload: error.response.data.msg || 'something went wrong - try again'
		});
	}
};

export const getClientItems = (client, invoices) => async dispatch => {
	try {
		const jobs = invoices
			.filter(inv => (inv.client._id === client._id ? inv : null))
			.map(i => i.items)
			.flat(2);

		const orderedJobs = jobs.sort((a, b) => (a.date < b.date ? 1 : -1));

		dispatch({
			type: GET_CLIENT_ITEMS,
			payload: { name: client.name, items: jobs }
		});
	} catch (error) {
		dispatch({
			type: CLIENT_ERROR,
			payload: 'error retrieving client jobs'
		});
		await dispatch(setAlert(error.response.data.msg, 'warn'));
		await dispatch(clearClientErrors());
	}
};

export const clearClientItems = () => async dispatch => {
	dispatch({
		type: CLEAR_CLIENT_ITEMS
	});
};
