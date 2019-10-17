import { ADD_INVOICE_DATA, ADD_EXPENSE_DATA, CLEAR_REPORT, REPORT_ERROR} from '../actions/types';

const initialState = {
  data: [],
  error: '',
  invoices: false,
  expenses : false
};

export default (state = initialState, action) => {
	switch (action.type) {
    case ADD_INVOICE_DATA:
			return {
				...state,
        data: [...state.data, action.payload],
        invoices: true,
        error: ''
      };
    case ADD_EXPENSE_DATA:
			return {
				...state,
        data: [...state.data, action.payload],
        expenses: true,
        error: ''
			};
		case CLEAR_REPORT:
			return {
				...state,
        data: [],
        error: '',
        invoices: false,
        expenses: false,

      };
    case REPORT_ERROR:
			return {
        ...state,
        data: [],
        error: 'something went wrong, please try that again',
        invoices: false,
        expenses: false,
      };
		default:
			return state;
	}
};
