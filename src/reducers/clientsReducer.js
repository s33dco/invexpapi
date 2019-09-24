import {
	GET_CLIENTS,
	ADD_CLIENT,
	CLIENT_ERROR,
	CLEAR_CLIENTS,
	CLEAR_CLIENT_ERRORS
} from '../actions/types';

const initialState = {
	clients: [],
	error: ''
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_CLIENTS:
			return {
				...state,
				clients: [...action.payload],
				error: ''
			};
		case ADD_CLIENT:
			return {
				...state,
				clients: [...state.clients, action.payload],
				error: ''
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
