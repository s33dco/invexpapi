import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// destructure compoent:Compoent and use rest for props

const PrivateRoute = ({
	component: Component,
	isAuthenticated,
	user,
	...rest
}) => {
	return (
		<Route
			{...rest}
			render={props =>
				!isAuthenticated && !user ? (
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
	user: state.auth.user
});

export default connect(mapStateToProps)(PrivateRoute);
