import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import businessReducer from './businessReducer';
import clientsReducer from './clientsReducer';
import expensesReducer from './expensesReducer';
// import invoiceReducer from './invoiceReducer';

export default combineReducers({
	auth: authReducer,
	alert: alertReducer,
	business: businessReducer,
	clients: clientsReducer,
	expenses: expensesReducer
	// invoice: invoiceReducer,
});
