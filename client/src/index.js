import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './components/App';
import store from './store';
import 'typeface-roboto'
import '../styles/styles.scss';

ReactDOM.render(
		<Provider store={store}>
			<MuiPickersUtilsProvider utils={MomentUtils} locale="en">
				<CssBaseline />
          <App />
      </MuiPickersUtilsProvider>
		</Provider>, document.getElementById('root'));

