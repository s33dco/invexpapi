import React, { useEffect } from 'react';
import {
	Switch,
	BrowserRouter as Router,
	Route,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';
import NavBar from './layout/NavBar';
import Alerts from './layout/Alerts';
import RefreshDialog from './RefreshDialog';
import Footer from './layout/Footer';
import PrivateRoute from './PrivateRoute';
import Home from './home/Home';
import Invoices from './invoices/Invoices';
import Expenses from './expenses/Expenses';
import Clients from './clients/Clients';
import Business from './business/Business';
import Reports from './reports/Reports';
import Contact from './contact/Contact';
import NoMatch from './NoMatch';
import { loadUser } from '../actions/authActions';

const useStyles = makeStyles(() => ({
	body: {
		display: 'flex',
		flexDirection: 'column',
		margin: '0',
		padding: '0',
		minHeight: '100vh',
	},
	header: {
		height: '0',
	},
	main: {
		flex: '1',
		minHeight: '95vh',
		paddingTop: '60px',
	},
	footer: {
		flex: '0',
		padding: '1vh 2.5vw',
	},
	'@media (min-width: 600px)': {
		main: {
			paddingLeft: 152,
		},
	},
}));

const App = ({ token, isAuthenticated, loadUser }) => {
	const classes = useStyles();

	useEffect(() => {
		if (!isAuthenticated && !token) {
			loadUser();
		}
	}, []);

	return (
		<Router>
			<Container component="div" className={classes.body}>
				<Container component="header" className={classes.header}>
					<NavBar />
				</Container>
				<Container component="main" className={classes.main}>
					<Alerts />
					<RefreshDialog />
					<Switch>
						<Route exact path="/" component={Home} />
						<PrivateRoute
							exact
							path="/invoices"
							component={Invoices}
						/>
						<PrivateRoute exact path="/clients" component={Clients} />
						<PrivateRoute
							exact
							path="/expenses"
							component={Expenses}
						/>
						<PrivateRoute
							exact
							path="/business"
							component={Business}
						/>
						<PrivateRoute exact path="/reports" component={Reports} />
						<Route exact path="/contact" component={Contact} />
						<Route component={NoMatch} />
					</Switch>
				</Container>
				<Container component="footer" className={classes.footer}>
					<Footer />
				</Container>
			</Container>
		</Router>
	);
};
const mapStateToProps = state => ({
	token: state.auth.token,
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(
	mapStateToProps,
	{ loadUser }
)(App);
