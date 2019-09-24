import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { addClient } from '../../actions/clientsActions';
import sentanceCase from '../../../config/sentanceCase';
import AddClient from './AddClient';

const Clients = clients => {
	return (
		<Fragment>
			<h1>You have {clients.length} Clients</h1>
			<AddClient />
		</Fragment>
	);
};

Clients.propTypes = {};

const mapStateToProps = state => ({
	clients: state.clients.clients
});

export default connect(
	mapStateToProps,
	{ addClient }
)(Clients);
