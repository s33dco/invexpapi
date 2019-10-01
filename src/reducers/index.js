import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import businessReducer from './businessReducer';
import clientsReducer from './clientsReducer';
import expensesReducer from './expensesReducer';
import invoicesReducer from './invoicesReducer';

export default combineReducers({
	auth: authReducer,
	alert: alertReducer,
	business: businessReducer,
	clients: clientsReducer,
	expenses: expensesReducer,
	invoices: invoicesReducer
});
