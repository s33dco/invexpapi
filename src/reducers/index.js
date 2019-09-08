import { combineReducers } from 'redux';
import invoiceReducer from './invoiceReducer';
import clientReducer from './clientReducer';
import expenseReducer from './expenseReducer';
import businessReducer from './businessReducer';
import authReducer from './authReducer';
import alertReducer from './authReducer';

export default combineReducers({
	alert: alertReducer,
	auth: authReducer,
	invoice: invoiceReducer,
	expense: expenseReducer,
	client: clientReducer,
	business: businessReducer
});
