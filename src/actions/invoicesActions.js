import axios from 'axios';
import { setAlert } from './alertActions';
import {
	GET_INVOICES,
	ADD_INVOICE,
	UPDATE_INVOICE,
	DELETE_INVOICE,
	INVOICE_ERROR,
	CLEAR_INVOICES,
	CLEAR_INVOICE_ERRORS,
	SET_CURRENT_INVOICE,
	CLEAR_CURRENT_INVOICE,
	SET_DELETE_INVOICE,
	CLEAR_DELETE_INVOICE
} from './types';

export const clearInvoices = () => async dispatch => {
	dispatch({
		type: CLEAR_INVOICES
	});
	await dispatch(setAlert('Invoices cleared', 'warn'));
};

export const clearInvoiceErrors = () => async dispatch => {
	dispatch({
		type: CLEAR_INVOICE_ERRORS
	});
};

export const setCurrentInvoice = invoice => async dispatch => {
	dispatch({
		type: SET_CURRENT_INVOICE,
		payload: invoice
	});
};

export const clearCurrentInvoice = () => async dispatch => {
	dispatch({
		type: CLEAR_CURRENT_INVOICE
	});
};

export const setDeleteInvoice = invoice => async dispatch => {
	dispatch({
		type: SET_DELETE_INVOICE,
		payload: invoice
	});
};

export const clearDeleteInvoice = () => async dispatch => {
	dispatch({
		type: CLEAR_DELETE_INVOICE
	});
};

export const getInvoices = () => async dispatch => {
	try {
		const res = await axios.get(`${process.env.API_URL}/invoices`);
		dispatch({
			type: GET_INVOICES,
			payload: res.data
		});
	} catch (error) {
		dispatch({
			type: INVOICE_ERROR,
			payload: error.response.data.msg || 'something went wrong - try again'
		});
		const message =
			error.response.data.msg || 'something went wrong - try again';
		await dispatch(setAlert(message, 'warn'));
		await dispatch(clearInvoiceErrors());
	}
};

export const addInvoice = formData => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};

	try {
		const res = await axios.post(
			`${process.env.API_URL}/invoices`,
			formData,
			config
		);

		dispatch({
			type: ADD_INVOICE,
			payload: res.data
		});

		await dispatch(setAlert('Invoice Created!', 'info'));
	} catch (error) {
		dispatch({
			type: INVOICE_ERROR,
			payload: error.response.data.msg || 'something went wrong - try again'
		});
	}
};

export const updateInvoice = (id, formData) => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};

	try {
		const res = await axios.put(
			`${process.env.API_URL}/invoices/${id}`,
			formData,
			config
		);

		dispatch({
			type: UPDATE_INVOICE,
			payload: res.data
		});
		await dispatch(setAlert('Invoice Updated!', 'info'));
	} catch (error) {
		dispatch({
			type: INVOICE_ERROR,
			payload: error.response.data.msg || 'something went wrong - try again'
		});
	}
};

export const deleteInvoice = id => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};

	try {
		const res = await axios.delete(
			`${process.env.API_URL}/invoices/${id}`,
			config
		);

		dispatch({
			type: DELETE_INVOICE,
			payload: id
		});

		await dispatch(setAlert(res.data.msg, 'info'));
	} catch (error) {
		dispatch({
			type: INVOICE_ERROR,
			payload: error.response.data.msg || 'something went wrong - try again'
		});
	}
};
