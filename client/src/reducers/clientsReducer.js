import {
	GET_CLIENTS,
	ADD_CLIENT,
	CLIENT_ERROR,
	CLEAR_CLIENTS,
	CLEAR_CLIENT_ERRORS,
	SET_CURRENT_CLIENT,
	CLEAR_CURRENT_CLIENT,
	UPDATE_CLIENT,
	SET_DELETE_CLIENT,
	CLEAR_DELETE_CLIENT,
	DELETE_CLIENT,
	GET_CLIENT_ITEMS,
	CLEAR_CLIENT_ITEMS,
} from '../actions/types';

const initialState = {
	clients: [],
	error: '',
	current: '',
	delete: '',
	clientItems: { name: '', items: [] },
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_CLIENT_ITEMS:
			return {
				...state,
				clientItems: {
					name: action.payload.name,
					items: [...action.payload.items],
				},
			};
		case CLEAR_CLIENT_ITEMS:
			return {
				...state,
				clientItems: {},
			};
		case GET_CLIENTS:
			return {
				...state,
				clients: [...action.payload],
			};
		case ADD_CLIENT:
			return {
				...state,
				clients: [...state.clients, action.payload],
			};
		case CLIENT_ERROR:
			return {
				...state,
				error: action.payload,
			};
		case CLEAR_CLIENT_ERRORS:
			return {
				...state,
				error: '',
			};
		case SET_CURRENT_CLIENT:
			return {
				...state,
				current: action.payload,
			};
		case CLEAR_CURRENT_CLIENT:
			return {
				...state,
				current: '',
			};
		case UPDATE_CLIENT:
			return {
				...state,
				clients: state.clients.map(client =>
					client._id === action.payload._id ? action.payload : client
				),
			};
		case SET_DELETE_CLIENT:
			return {
				...state,
				delete: action.payload,
			};
		case CLEAR_DELETE_CLIENT:
			return {
				...state,
				delete: '',
			};
		case DELETE_CLIENT:
			return {
				...state,
				clients: state.clients.filter(
					client => client._id !== action.payload
				),
			};
		case CLEAR_CLIENTS:
			return {
				...state,
				clients: [],
				error: '',
				current: '',
				delete: '',
			};
		default:
			return state;
	}
};
