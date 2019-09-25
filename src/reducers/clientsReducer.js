import {
	GET_CLIENTS,
	ADD_CLIENT,
	CLIENT_ERROR,
	CLEAR_CLIENTS,
	CLEAR_CLIENT_ERRORS,
	SET_CURRENT_CLIENT,
	CLEAR_CURRENT_CLIENT,
	UPDATE_CLIENT
} from '../actions/types';

const initialState = {
	clients: [],
	error: '',
	current: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_CLIENTS:
			return {
				...state,
				clients: [...action.payload]
			};
		case ADD_CLIENT:
			return {
				...state,
				clients: [...state.clients, action.payload]
			};
		case CLIENT_ERROR:
			return {
				...state,
				error: action.payload
			};
		case CLEAR_CLIENT_ERRORS:
			return {
				...state,
				error: ''
			};
		case SET_CURRENT_CLIENT:
			return {
				...state,
				current: action.payload
			};
		case CLEAR_CURRENT_CLIENT:
			return {
				...state,
				current: null
			};
		case UPDATE_CLIENT:
			return {
				...state,
				clients: state.clients.map(client =>
					client._id === action.payload._id ? action.payload : client
				)
			};
		case CLEAR_CLIENTS:
			return {
				...state,
				clients: [],
				error: ''
			};
		default:
			return state;
	}
};
