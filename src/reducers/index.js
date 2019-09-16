import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
// import invoiceReducer from './invoiceReducer';
// import clientReducer from './clientReducer';
// import expenseReducer from './expenseReducer';
// import businessReducer from './businessReducer';

export default combineReducers({
	auth: authReducer,
	alert: alertReducer
	// invoice: invoiceReducer,
	// expense: expenseReducer,
	// client: clientReducer,
	// business: businessReducer
});
