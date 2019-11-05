import { selectOptions } from '../../../server/models/expense';
import {
	GET_EXPENSES,
	ADD_EXPENSE,
	EXPENSE_ERROR,
	CLEAR_EXPENSES,
	CLEAR_EXPENSE_ERRORS,
	SET_CURRENT_EXPENSE,
	CLEAR_CURRENT_EXPENSE,
	UPDATE_EXPENSE,
	SET_DELETE_EXPENSE,
	CLEAR_DELETE_EXPENSE,
	DELETE_EXPENSE,
} from '../actions/types';

const initialState = {
	expenses: [],
	categories: selectOptions,
	current: '',
	delete: '',
	error: '',
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_EXPENSES:
			return {
				...state,
				expenses: [...action.payload],
			};
		case ADD_EXPENSE:
			return {
				...state,
				expenses: [...state.expenses, action.payload],
			};
		case EXPENSE_ERROR:
			return {
				...state,
				error: action.payload,
			};
		case CLEAR_EXPENSE_ERRORS:
			return {
				...state,
				error: '',
			};
		case SET_CURRENT_EXPENSE:
			return {
				...state,
				current: action.payload,
			};
		case CLEAR_CURRENT_EXPENSE:
			return {
				...state,
				current: '',
			};
		case UPDATE_EXPENSE:
			return {
				...state,
				expenses: state.expenses.map(exp =>
					exp._id === action.payload._id ? action.payload : exp
				),
			};
		case SET_DELETE_EXPENSE:
			return {
				...state,
				delete: action.payload,
			};
		case CLEAR_DELETE_EXPENSE:
			return {
				...state,
				delete: '',
			};
		case DELETE_EXPENSE:
			return {
				...state,
				expenses: state.expenses.filter(
					exp => exp._id !== action.payload
				),
			};
		case CLEAR_EXPENSES:
			return {
				...state,
				expenses: [],
				error: '',
				current: '',
				delete: '',
			};
		default:
			return state;
	}
};
