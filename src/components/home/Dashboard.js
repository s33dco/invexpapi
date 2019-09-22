import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getBusiness } from '../../actions/businessActions';
import { setAlert } from '../../actions/alertActions';
// import { setAlert } from '../../actions/alertActions';

const Dashboard = ({ userId, businessError, getBusiness, setAlert }) => {
	useEffect(() => {
		getBusiness();
		// getClients();
		// getInvoices();
		// getExpenses();
		if (businessError) {
			setAlert(businessError, 'warn');
		}
	}, [businessError, userId]);

	return <div>{userId}</div>;
};

Dashboard.propTypes = {};

const mapStateToProps = state => ({
	business: state.business.business,
	businessError: state.business.error,
	userId: state.auth.user._id
});

export default connect(
	mapStateToProps,
	{ getBusiness, setAlert }
)(withRouter(Dashboard));
