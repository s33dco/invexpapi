/* eslint-disable react/jsx-indent */
/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
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
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...rest}
			render={props =>
				!isAuthenticated && !user ? (
					<Redirect to="/" />
				) : (
					// eslint-disable-next-line react/jsx-props-no-spreading
					<Component {...props} />
				)
			}
		/>
	);
};

PrivateRoute.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	user: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string,
	}),
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user,
});

export default connect(mapStateToProps)(PrivateRoute);
