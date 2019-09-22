import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import About from './About';
import Dashboard from './Dashboard';

const Home = ({ isAuthenticated, user, token }) => {
	return (
		<div className="container">
			{isAuthenticated && user && token ? <Dashboard/> : <About />}
		</div>
	);
};

Home.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	token: PropTypes.string
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user,
	token: state.auth.token
});

export default connect(mapStateToProps)(Home);
