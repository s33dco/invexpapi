import { setAlert } from './alertActions';
import {ADD_INVOICE_DATA, ADD_EXPENSE_DATA, CLEAR_REPORT, REPORT_ERROR, REPORT_READY} from './types';

export const sendInvoicesDataForReports = (invoices) => async dispatch => {
  console.log('from actions invoices',invoices)
	// dispatch({
  //   type: ADD_INVOICE_DATA,
  //   payload: data
	// });
};

export const sendExpensesDataForReports = (expenses) => async dispatch => {
  console.log('from actions expenses',expenses)
	// dispatch({
  //   type: ADD_EXPENSE_DATA,
  //   payload: data
	// });
};


export const clearReportData = () => async dispatch => {
	dispatch({
    type: CLEAR_REPORT
	});
	await dispatch(setAlert('Report cleared', 'warn'));
};