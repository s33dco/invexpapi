import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import importedComponent from 'react-imported-component';
import { Provider } from 'react-redux';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import NavBar from './layout/NavBar';
import Alerts from './layout/Alerts';
import Footer from './layout/Footer';
import Loading from './layout/Loading';
import PrivateRoute from './PrivateRoute';
import Home from './home/Home';

import store from '../store';

const AsyncInvoices = importedComponent(
	() => import(/* webpackChunkName:'Invoices' */ './invoices/Invoices'),
	{
		LoadingComponent: Loading
	}
);
const AsyncExpenses = importedComponent(
	() => import(/* webpackChunkName:'Expenses' */ './expenses/Expenses'),
	{
		LoadingComponent: Loading
	}
);
const AsyncClients = importedComponent(
	() => import(/* webpackChunkName:'Clients' */ './clients/Clients'),
	{
		LoadingComponent: Loading
	}
);
const AsyncReports = importedComponent(
	() => import(/* webpackChunkName:'Reports' */ './reports/Reports'),
	{
		LoadingComponent: Loading
	}
);

const AsyncBusiness = importedComponent(
	() => import(/* webpackChunkName:'Business' */ './business/Business'),
	{
		LoadingComponent: Loading
	}
);
const AsyncContact = importedComponent(
	() => import(/* webpackChunkName:'Contact' */ './contact/Contact'),
	{
		LoadingComponent: Loading
	}
);
const AsyncNoMatch = importedComponent(
	() => import(/* webpackChunkName:'NoMatch' */ './NoMatch'),
	{
		LoadingComponent: Loading
	}
);

const useStyles = makeStyles(theme => ({
	body: {
		display: 'flex',
		flexDirection: 'column',
		margin: '0',
		padding: '0',
		minHeight: '100vh'
	},
	header: {
		height: '0'
	},
	main: {
		flex: '1',
		minHeight: '95vh',
		paddingTop: '60px'
	},
	footer: {
		flex: '0',
		padding: '1vh 2.5vw'
	},
	'@media (min-width: 600px)': {
		main: {
			paddingLeft: 152
		}
	}
}));

const App = () => {
	const classes = useStyles();
	return (
		<Provider store={store}>
			<MuiPickersUtilsProvider utils={MomentUtils} locale="en">
				<CssBaseline />
				<Router>
					<Container component="div" className={classes.body}>
						<Container component="header" className={classes.header}>
							<NavBar />
						</Container>
						<Container component="main" className={classes.main}>
							<Alerts />
							<Switch>
								<Route exact path="/" component={Home} />
								<PrivateRoute
									exact
									path="/invoices"
									component={AsyncInvoices}
								/>
								<PrivateRoute exact path="/clients" component={AsyncClients} />
								<PrivateRoute
									exact
									path="/expenses"
									component={AsyncExpenses}
								/>
								<PrivateRoute
									exact
									path="/business"
									component={AsyncBusiness}
								/>
								<PrivateRoute exact path="/reports" component={AsyncReports} />
								<Route exact path="/contact" component={AsyncContact} />
								<Route component={AsyncNoMatch} />
							</Switch>
						</Container>
						{/* </main> */}
						<Container component="footer" className={classes.footer}>
							<Footer />
						</Container>
					</Container>
				</Router>
			</MuiPickersUtilsProvider>
		</Provider>
	);
};

export default hot(App);
