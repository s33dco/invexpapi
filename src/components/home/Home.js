import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import About from './About';
import Dashboard from './Dashboard';

const Home = ({ isAuthenticated }) => {
	return (
		<div className="container">
			{isAuthenticated ? <Dashboard /> : <About />}
		</div>
	);
};

Home.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	token: PropTypes.string
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Home);
