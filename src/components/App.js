import { hot } from 'react-hot-loader/root';
import React, { useEffect } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import importedComponent from 'react-imported-component';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import { Provider } from 'react-redux';
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

const App = () => {
	useEffect(() => {
		// Init Materialize JS
		M.AutoInit();
	});

	return (
		<Provider store={store}>
			<Router>
				<header>
					<NavBar />
				</header>
				<main>
					<Alerts />
					<div className="container">
						<Switch>
							<Route exact path="/" component={Home} />
							<PrivateRoute exact path="/invoices" component={AsyncInvoices} />
							<PrivateRoute exact path="/clients" component={AsyncClients} />
							<PrivateRoute exact path="/expenses" component={AsyncExpenses} />
							<PrivateRoute exact path="/business" component={AsyncBusiness} />
							<PrivateRoute exact path="/reports" component={AsyncReports} />
							<Route exact path="/contact" component={AsyncContact} />
							<Route component={AsyncNoMatch} />
						</Switch>
					</div>
				</main>
				<Footer />
			</Router>
		</Provider>
	);
};

export default hot(App);
