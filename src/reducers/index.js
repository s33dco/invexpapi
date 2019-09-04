import { combineReducers } from 'redux';
import invoiceReducer from './invoiceReducer';
import clientReducer from './clientReducer';
import expenseReducer from './expenseReducer';
import businessReducer from './businessReducer';

export default combineReducers({
	invoice: invoiceReducer,
	expense: expenseReducer,
	client: clientReducer,
	business: businessReducer
});
