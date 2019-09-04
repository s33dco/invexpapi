import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import importedComponent from 'react-imported-component';
import { Provider } from 'react-redux';
import 'normalize.css/normalize.css';
import store from '../store';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Loading from './layout/Loading';
import Home from './pages/Home';
import '../styles/styles.scss';

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
			<Provider store={store}>
				<Router>
					<Header />
					<main className="main">
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/invoices" component={AsyncInvoices} />
							<Route exact path="/clients" component={AsyncClients} />
							<Route exact path="/expenses" component={AsyncExpenses} />
							<Route exact path="/reports" component={AsyncReports} />
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
