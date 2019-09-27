import axios from 'axios';
import { setAlert } from './alertActions';
import {
	GET_EXPENSES,
	ADD_EXPENSE,
	UPDATE_EXPENSE,
	DELETE_EXPENSE,
	EXPENSE_ERROR,
	CLEAR_EXPENSES,
	CLEAR_EXPENSE_ERRORS,
	SET_CURRENT_EXPENSE,
	CLEAR_CURRENT_EXPENSE,
	SET_DELETE_EXPENSE,
	CLEAR_DELETE_EXPENSE
} from './types';

export const clearExpenses = () => async dispatch => {
	dispatch({
		type: CLEAR_EXPENSES
	});
	await dispatch(setAlert('Expenses cleared', 'warn'));
};

export const clearExpenseErrors = () => async dispatch => {
	dispatch({
		type: CLEAR_EXPENSE_ERRORS
	});
};

export const setCurrentExpense = expense => async dispatch => {
	dispatch({
		type: SET_CURRENT_EXPENSE,
		payload: expense
	});
};

export const clearCurrentExpense = () => async dispatch => {
	dispatch({
		type: CLEAR_CURRENT_EXPENSE
	});
};

export const setDeleteExpense = expense => async dispatch => {
	dispatch({
		type: SET_DELETE_EXPENSE,
		payload: expense
	});
};

export const clearDeleteExpense = () => async dispatch => {
	dispatch({
		type: CLEAR_DELETE_EXPENSE
	});
};

export const getExpenses = () => async dispatch => {
	try {
		const res = await axios.get(`${process.env.API_URL}/expenses`);
		dispatch({
			type: GET_EXPENSES,
			payload: res.data
		});
	} catch (error) {
		dispatch({
			type: EXPENSE_ERROR,
			payload: { msg: error.response.data.msg }
		});
		await dispatch(setAlert(error.response.data.msg, 'warn'));
		await dispatch(clearExpenseErrors());
	}
};

export const addExpense = formData => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};

	try {
		const res = await axios.post(
			`${process.env.API_URL}/expenses`,
			formData,
			config
		);

		dispatch({
			type: ADD_EXPENSE,
			payload: res.data
		});

		await dispatch(setAlert('Expense Created!', 'info'));
	} catch (error) {
		dispatch({
			type: EXPENSE_ERROR,
			payload: error.response.data.msg
		});
	}
};

export const updateExpense = (id, formData) => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};

	try {
		const res = await axios.put(
			`${process.env.API_URL}/expenses/${id}`,
			formData,
			config
		);

		dispatch({
			type: UPDATE_EXPENSE,
			payload: res.data
		});
		await dispatch(setAlert('Expense Updated!', 'info'));
	} catch (error) {
		dispatch({
			type: EXPENSE_ERROR,
			payload: error.response.data.msg
		});
	}
};

export const deleteExpense = id => async dispatch => {
	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};

	try {
		const res = await axios.delete(
			`${process.env.API_URL}/expenses/${id}`,
			config
		);

		dispatch({
			type: DELETE_EXPENSE,
			payload: id
		});

		await dispatch(setAlert(res.data.msg, 'info'));
	} catch (error) {
		dispatch({
			type: EXPENSE_ERROR,
			payload: error.response.data.msg
		});
	}
};
