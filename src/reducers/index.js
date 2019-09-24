import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import businessReducer from './businessReducer';
import clientsReducer from './clientsReducer';
// import invoiceReducer from './invoiceReducer';

// import expenseReducer from './expenseReducer';

export default combineReducers({
	auth: authReducer,
	alert: alertReducer,
	business: businessReducer,
	clients: clientsReducer
	// invoice: invoiceReducer,
	// expense: expenseReducer,
});
