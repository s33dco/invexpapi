import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { addClient } from '../../actions/clientsActions';
import sentanceCase from '../../../config/sentanceCase';
import AddClient from './AddClient';
import ClientCard from './ClientCard';
import EditClient from './EditClient';

const Clients = ({ clients }) => {
	// useEffect(() => {
	// 	// eslint - disable - next - line;
	// }, [clients]); // check for changes from api, api error and change in record being updated

	return (
		<Fragment>
			{clients.map(client => (
				<ClientCard key={client._id} client={client} />
			))}
			<EditClient />
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
