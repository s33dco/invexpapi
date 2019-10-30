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
	CLEAR_DELETE_INVOICE,
	MARK_AS_PAID,
	MARK_AS_UNPAID,
	EMAIL_INVOICE,
} from './types';

export const clearInvoices = () => async dispatch => {
	dispatch({
		type: CLEAR_INVOICES,
	});
};
export const clearInvoiceErrors = () => async dispatch => {
	dispatch({
		type: CLEAR_INVOICE_ERRORS,
	});
};
export const setCurrentInvoice = invoice => async dispatch => {
	dispatch({
		type: SET_CURRENT_INVOICE,
		payload: invoice,
	});
};
export const clearCurrentInvoice = () => async dispatch => {
	dispatch({
		type: CLEAR_CURRENT_INVOICE,
	});
};
export const setDeleteInvoice = invoice => async dispatch => {
	dispatch({
		type: SET_DELETE_INVOICE,
		payload: invoice,
	});
};
export const clearDeleteInvoice = () => async dispatch => {
	dispatch({
		type: CLEAR_DELETE_INVOICE,
	});
};
export const getInvoices = () => async dispatch => {
	try {
		const res = await axios.get(`${process.env.API_URL}/invoices`);
		dispatch({
			type: GET_INVOICES,
			payload: res.data,
		});
	} catch (error) {
		dispatch({
			type: INVOICE_ERROR,
			payload:
				error.response.data.msg || 'something went wrong - try again',
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
			'Content-type': 'application/json',
		},
	};

	try {
		const res = await axios.post(
			`${process.env.API_URL}/invoices`,
			formData,
			config
		);

		dispatch({
			type: ADD_INVOICE,
			payload: res.data,
		});

		await dispatch(setAlert('Invoice Created!', 'info'));
	} catch (error) {
		dispatch({
			type: INVOICE_ERROR,
			payload:
				error.response.data.msg ||
				error.message ||
				'something went wrong',
		});
	}
};
export const updateInvoice = (id, formData) => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json',
		},
	};

	try {
		const res = await axios.put(
			`${process.env.API_URL}/invoices/${id}`,
			formData,
			config
		);

		dispatch({
			type: UPDATE_INVOICE,
			payload: res.data,
		});
		await dispatch(
			setAlert(`Invoice ${res.data.invNo} updated!`, 'info')
		);
	} catch (error) {
		dispatch({
			type: INVOICE_ERROR,
			payload:
				error.response.data.msg || 'something went wrong - try again',
		});
	}
};
export const deleteInvoice = id => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json',
		},
	};

	try {
		const res = await axios.delete(
			`${process.env.API_URL}/invoices/${id}`,
			config
		);

		dispatch({
			type: DELETE_INVOICE,
			payload: id,
		});

		await dispatch(
			setAlert(`Invoice ${res.data.invNo} deleted`, 'info')
		);
	} catch (error) {
		dispatch({
			type: INVOICE_ERROR,
			payload:
				error.response.data.msg || 'something went wrong - try again',
		});
	}
};
export const payInvoice = id => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json',
		},
	};

	try {
		const res = await axios.patch(
			`${process.env.API_URL}/invoices/paid/${id}`,
			config
		);

		dispatch({
			type: MARK_AS_PAID,
			payload: res.data,
		});

		await dispatch(
			setAlert(`Invoice ${res.data.invNo} paid 😃`, 'info')
		);
	} catch (error) {
		console.log(error);
		dispatch({
			type: INVOICE_ERROR,
			payload:
				error.response.data.msg || 'something went wrong - try again',
		});
	}
};
export const unpayInvoice = id => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json',
		},
	};

	try {
		const res = await axios.patch(
			`${process.env.API_URL}/invoices/unpaid/${id}`,
			config
		);

		dispatch({
			type: MARK_AS_UNPAID,
			payload: res.data,
		});

		await dispatch(
			setAlert(`Invoice ${res.data.invNo} unpaid ☹️`, 'info')
		);
	} catch (error) {
		console.log(error);

		dispatch({
			type: INVOICE_ERROR,
			payload:
				error.response.data.msg || 'something went wrong - try again',
		});
	}
};
export const emailInvoice = (info, file) => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'multipart/form-data',
		},
	};

	const data = new FormData();
	data.append('file', file);

	const fields = Object.entries(info);

	for (const [name, value] of fields) {
		data.append(name, value);
	}

	try {
		const res = await axios.post(
			`${process.env.API_URL}/invoices/email`,
			data,
			config
		);

		dispatch({
			type: EMAIL_INVOICE,
			payload: res.data,
		});

		await dispatch(
			setAlert(`Invoice emailed to ${info.clientName}`, 'info')
		);
	} catch (error) {
		dispatch({
			type: INVOICE_ERROR,
			payload:
				error.response.data.msg || 'something went wrong - try again',
		});
	}
};
