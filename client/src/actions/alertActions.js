import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export default (msg, type, timeout = 5500) => async dispatch => {
	const id = uuid.v4();

	dispatch({
		type: SET_ALERT,
		payload: { msg, type, id },
	});
	setTimeout(
		() => dispatch({ type: REMOVE_ALERT, payload: id }),
		timeout
	);
};