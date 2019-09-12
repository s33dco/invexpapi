import { hot } from 'react-hot-loader/root';
import React, { useEffect } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import importedComponent from 'react-imported-component';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import { Provider } from 'react-redux';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Loading from './layout/Loading';
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
		<div className="container">
			<Provider store={store}>
				<Router>
					<Header />
					<main className="container">
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/invoices" component={AsyncInvoices} />
							<Route exact path="/clients" component={AsyncClients} />
							<Route exact path="/expenses" component={AsyncExpenses} />
							<Route exact path="/business" component={AsyncBusiness} />
							<Route exact path="/reports" component={AsyncReports} />
							<Route exact path="/contact" component={AsyncContact} />
							<Route component={AsyncNoMatch} />
						</Switch>
					</main>
					<Footer />
				</Router>
			</Provider>
		</div>
	);
};

export default hot(App);
