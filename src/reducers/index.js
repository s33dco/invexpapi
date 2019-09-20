import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import businessReducer from './businessReducer';
// import invoiceReducer from './invoiceReducer';
// import clientReducer from './clientReducer';
// import expenseReducer from './expenseReducer';

export default combineReducers({
	auth: authReducer,
	alert: alertReducer,
	business: businessReducer
	// invoice: invoiceReducer,
	// expense: expenseReducer,
	// client: clientReducer,
});
