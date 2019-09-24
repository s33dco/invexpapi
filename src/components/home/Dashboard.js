import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getBusiness } from '../../actions/businessActions';
import { getClients } from '../../actions/clientsActions';
import { setAlert } from '../../actions/alertActions';

const Dashboard = ({
	setAlert,
	business,
	clients,
	businessError,
	clientError
}) => {
	useEffect((clients, business) => {
		if (businessError.error === 'notFound') {
			setAlert(businessError.msg, 'warn');
		}
		if (clientError.error === 'notFound') {
			setAlert(clientError.msg, 'warn');
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
	userId: state.auth.user._id
});

export default connect(
	mapStateToProps,
	{ getBusiness, getClients, setAlert }
)(Dashboard);
