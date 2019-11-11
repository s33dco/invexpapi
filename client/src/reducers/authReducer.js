import jwtDecode from 'jwt-decode'

import {
	USER_LOADED,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	AUTH_ERROR,
	CLEAR_AUTH_ERRORS,
	LOGOUT,
	RELOGIN,
	REFRESH_TOKEN
} from '../actions/types';

const initialState = {
	token: null,
	isAuthenticated: false,
	loading: true,
	user: null,
	error: null,
	relogin: false,
	expiresAt: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case RELOGIN:
			return {
				...state,
				relogin: true
			}
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				user: action.payload.user,
			};
		case LOGIN_SUCCESS:
		case REGISTER_SUCCESS:
			localStorage.setItem('token', action.payload.token);
			const tokenExpiration = jwtDecode(action.payload.token).exp;
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				token: action.payload.token,
				expiresAt: tokenExpiration
			};
		case REFRESH_TOKEN:
			localStorage.removeItem('token');
			localStorage.setItem('token', action.payload.token);
			const expires = jwtDecode(action.payload.token).exp;
			return {
				...state,
				token: action.payload.token,
				relogin: false,
				expiresAt: expires
			};
		case LOGIN_FAIL:
		case REGISTER_FAIL:
		case AUTH_ERROR:
		case LOGOUT:
			localStorage.removeItem('token');
			return {
				...state,
				token: null,
				isAuthenticated: false,
				loading: false,
				user: null,
				error: action.payload,
				relogin: false,
				expiresAt: null
			};
		case CLEAR_AUTH_ERRORS:
			return {
				...state,
				error: null,
			};
		default:
			return state;
	}
};
