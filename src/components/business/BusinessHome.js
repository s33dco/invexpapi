import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const BusinessHome = ({ business }) => {
	return <div>Business Details</div>;
};

Business.propTypes = {};

const mapStateToProps = state => ({
	business: state.business.business,
});

export default connect(mapStateToProps)(BusinessHome);
