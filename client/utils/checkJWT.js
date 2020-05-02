import jwtDecode from 'jwt-decode'
import moment from 'moment'
import {LOGOUT, SET_ALERT, RELOGIN, REMOVE_ALERT} from '../src/actions/types'

const checkJWT = store => dispatch => action => {
 
	if (store.getState().auth && store.getState().auth.token) {
		const tokenExpiration = jwtDecode(store.getState().auth.token).exp;
		const expiresAt = moment.unix(tokenExpiration).utc()

		if (tokenExpiration - (moment().unix()) < 300 ){
			dispatch({ type: RELOGIN})
		}
		if (expiresAt < moment().utc()){
			dispatch({type: LOGOUT})
			dispatch({
				type: SET_ALERT,
				payload: { msg:"you've been logged out", type:'info', id:'999' },
			})
			setTimeout(
				() => dispatch({ type: REMOVE_ALERT, payload: '999' }), 5500);
		} 
	}
	dispatch(action);
};

export default checkJWT;
