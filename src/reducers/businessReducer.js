import {
	GET_BUSINESS,
	ADD_BUSINESS,
	UPDATE_BUSINESS,
	BUSINESS_ERROR,
	CLEAR_BUSINESS,
	CLEAR_BUSINESS_ERROR,
} from '../actions/types';

const initialState = {
	business: {},
	error: '',
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_BUSINESS:
		case ADD_BUSINESS:
		case UPDATE_BUSINESS:
			return {
				...state,
				business: { ...action.payload },
				error: '',
			};
		case BUSINESS_ERROR:
			return {
				...state,
				error: action.payload,
			};
		case CLEAR_BUSINESS_ERROR:
			return {
				...state,
				error: '',
			};
		case CLEAR_BUSINESS:
			return {
				...state,
				business: {},
				error: '',
			};
		default:
			return state;
	}
};
