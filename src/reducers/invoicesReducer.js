import {
	GET_INVOICES,
	ADD_INVOICE,
	INVOICE_ERROR,
	CLEAR_INVOICES,
	CLEAR_INVOICE_ERRORS,
	SET_CURRENT_INVOICE,
	CLEAR_CURRENT_INVOICE,
	UPDATE_INVOICE,
	SET_DELETE_INVOICE,
	CLEAR_DELETE_INVOICE,
	DELETE_INVOICE,
	MARK_AS_PAID,
	MARK_AS_UNPAID,
	EMAIL_INVOICE
} from '../actions/types';

const initialState = {
	invoices: [],
	current: '',
	delete: '',
	error: ''
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_INVOICES:
			return {
				...state,
				invoices: [...action.payload]
			};
		case ADD_INVOICE:
			return {
				...state,
				invoices: [...state.invoices, action.payload]
			};
		case INVOICE_ERROR:
			return {
				...state,
				error: action.payload
			};
		case CLEAR_INVOICE_ERRORS:
			return {
				...state,
				error: ''
			};
		case SET_CURRENT_INVOICE:
			return {
				...state,
				current: action.payload
			};
		case CLEAR_CURRENT_INVOICE:
			return {
				...state,
				current: ''
			};
		case UPDATE_INVOICE:
		case MARK_AS_PAID:
		case MARK_AS_UNPAID:
		case EMAIL_INVOICE:
			return {
				...state,
				invoices: state.invoices.map(inv =>
					inv._id === action.payload._id ? action.payload : inv
				)
			};
		case SET_DELETE_INVOICE:
			return {
				...state,
				delete: action.payload
			};
		case CLEAR_DELETE_INVOICE:
			return {
				...state,
				delete: ''
			};
		case DELETE_INVOICE:
			return {
				...state,
				invoices: state.invoices.filter(exp => exp._id !== action.payload)
			};
		case CLEAR_INVOICES:
			return {
				...state,
				invoices: [],
				error: '',
				current: '',
				delete: ''
			};
		default:
			return state;
	}
};
