import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import importedComponent from 'react-imported-component';
import Dashboard from './pages/Dashboard';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Loading from './layout/Loading';
import 'normalize.css/normalize.css';
import '../styles/styles.scss';

const AsyncContact = importedComponent(
	() => import(/* webpackChunkName:'Contact' */ './pages/Contact'),
	{
		LoadingComponent: Loading
	}
);
const AsyncAbout = importedComponent(
	() => import(/* webpackChunkName:'About' */ './pages/About'),
	{
		LoadingComponent: Loading
	}
);
const AsyncRegister = importedComponent(
	() => import(/* webpackChunkName:'Register' */ './pages/Register'),
	{
		LoadingComponent: Loading
	}
);
const AsyncLogin = importedComponent(
	() => import(/* webpackChunkName:'Login' */ './pages/Login'),
	{
		LoadingComponent: Loading
	}
);
const AsyncInvoices = importedComponent(
	() => import(/* webpackChunkName:'Invoices' */ './pages/Invoices'),
	{
		LoadingComponent: Loading
	}
);
const AsyncExpenses = importedComponent(
	() => import(/* webpackChunkName:'Expenses' */ './pages/Expenses'),
	{
		LoadingComponent: Loading
	}
);
const AsyncClients = importedComponent(
	() => import(/* webpackChunkName:'Clients' */ './pages/Clients'),
	{
		LoadingComponent: Loading
	}
);
const AsyncReports = importedComponent(
	() => import(/* webpackChunkName:'Reports' */ './pages/Reports'),
	{
		LoadingComponent: Loading
	}
);
const AsyncNoMatch = importedComponent(
	() => import(/* webpackChunkName:'NoMatch' */ './pages/NoMatch'),
	{
		LoadingComponent: Loading
	}
);

const App = () => {
	return (
		<div className="container">
			<Router>
				<Header />
				<main className="main">
					<Switch>
						<Route exact path="/" component={Dashboard} />
						<Route exact path="/contact" component={AsyncContact} />
						<Route exact path="/about" component={AsyncAbout} />
						<Route exact path="/register" component={AsyncRegister} />
						<Route exact path="/login" component={AsyncLogin} />
						<Route exact path="/invoices" component={AsyncInvoices} />
						<Route exact path="/clients" component={AsyncClients} />
						<Route exact path="/expenses" component={AsyncExpenses} />
						<Route exact path="/reports" component={AsyncReports} />
						<Route component={AsyncNoMatch} />
					</Switch>
				</main>
				<Footer />
			</Router>
		</div>
	);
};

export default hot(App);
