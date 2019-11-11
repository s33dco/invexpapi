import jwtDecode from 'jwt-decode'
import moment from 'moment'
import axios from 'axios'
import {LOGOUT, SET_ALERT, RELOGIN} from '../src/actions/types'

// const refreshToken = async (dispatch) => {
// 	console.log('refreshUser called')
// 	const config = {
// 		headers: {
// 			'Content-type': 'application/json',
// 		},
// 	};
// 		try {
// 		const res = await axios.post(`${process.env.API_URL}/auth/refresh`, config);

// 		dispatch({
// 			type: REFRESH_TOKEN,
// 			payload: res.data,
// 		});

// 	} catch (error) {
// 		dispatch({
// 			type: AUTH_ERROR,
// 			payload:
// 				error.response.data.msg || 'something went wrong - try again',
// 		});
// 	}
// }

const checkJWT = store => dispatch => action => {
 
	if (store.getState().auth && store.getState().auth.token) {
		const tokenExpiration = jwtDecode(store.getState().auth.token).exp;
		const expiresAt = moment.unix(tokenExpiration).utc()

		if (tokenExpiration - (moment().unix()) < 120 ){
			dispatch({ type: RELOGIN})
		}
		if (expiresAt < moment().utc()){
			dispatch({type: LOGOUT})
			dispatch({
				type: SET_ALERT,
				payload: { msg:"you've been logged out", type:'info', id:'999' },
			});
		} 
	}
	dispatch(action);
};

export default checkJWT;
