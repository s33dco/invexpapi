import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AddBusiness from './AddBusiness';

const Business = ({ business }) => {
	return <AddBusiness />;
};

Business.propTypes = {};

const mapStateToProps = state => ({
	business: state.business.business
});

export default connect(mapStateToProps)(Business);
