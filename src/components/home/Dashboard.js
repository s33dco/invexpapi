import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getBusiness } from '../../actions/businessActions';
import { getClients } from '../../actions/clientsActions';
import { getExpenses } from '../../actions/expensesActions';
import { getInvoices } from '../../actions/invoicesActions';
import { setAlert } from '../../actions/alertActions';

const Dashboard = ({
	setAlert,
	business,
	clients,
	invoices,
	expenses,
	businessError,
	clientError,
	expensesError,
	invoicesError
}) => {
	useEffect((clients, business, invoices, expenses) => {
		if (businessError.error === 'notFound') {
			setAlert(businessError.msg, 'warn');
		}
		if (clientError.error === 'notFound') {
			setAlert(clientError.msg, 'warn');
		}
				if (expensesError.error === 'notFound') {
			setAlert(expensesError.msg, 'warn');
		}
				if (invoicesError.error === 'notFound') {
			setAlert(invoicesError.msg, 'warn');
		}
	}, []);

	return <div>DashBoard!</div>;
};

Dashboard.propTypes = {};

const mapStateToProps = state => ({
	business: state.business.business,
	businessError: state.business.error,
	clients: state.clients.clients,
	clientError: state.clients.error,
	expenses: state.expenses.expenses,
	expensesError: state.expenses.error,
	invoices: state.invoices.invoices,
	invoicesError: state.invoices.error,
	userId: state.auth.user._id
});

export default connect(
	mapStateToProps,
	{ getBusiness, getClients, setAlert }
)(Dashboard);
