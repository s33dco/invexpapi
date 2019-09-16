import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// destructure compoent:Compoent and use rest for props

const PrivateRoute = ({
	component: Component,
	isAuthenticated,
	loading,
	...rest
}) => {
	return (
		<Route
			{...rest}
			render={props =>
				!isAuthenticated && !loading ? (
					<Redirect to="/" />
				) : (
					<Component {...props} />
				)
			}
		/>
	);
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	loading: state.auth.loading
});

export default connect(mapStateToProps)(PrivateRoute);
