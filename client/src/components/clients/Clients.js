/* eslint-disable react/require-default-props */
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import AddClient from './AddClient';
import ClientCard from './ClientCard';
import EditClient from './EditClient';
import PreviousItems from './PreviousItems';
import DeleteClientDialog from './DeleteClientDialog';

const Clients = ({ clients }) => {
	const useStyles = makeStyles(theme => ({
		toolbar: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyItems: 'space-between',
			flexGrow: 1,
			padding: theme.spacing(1),
			backgroundColor: '#fff',
			width: '100%',
			borderRadius: theme.spacing(2),
			boxShadow: theme.shadows[1],
			margin: theme.spacing(1, 0),
		},
		search: {
			flexGrow: 1,
			position: 'relative',
			borderRadius: theme.shape.borderRadius,
			backgroundColor: fade(theme.palette.common.white, 0.15),
			'&:hover': {
				backgroundColor: fade(theme.palette.common.white, 0.25),
			},
			marginLeft: 0,
			width: '100%',
			[theme.breakpoints.up('sm')]: {
				marginLeft: theme.spacing(1),
				width: 'auto',
			},
		},
		searchIcon: {
			width: theme.spacing(7),
			height: '100%',
			position: 'absolute',
			pointerEvents: 'none',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		inputRoot: {
			color: 'inherit',
		},
		inputInput: {
			padding: theme.spacing(1, 1, 1, 7),
			transition: theme.transitions.create('width'),
			width: '100%',
			[theme.breakpoints.up('sm')]: {
				width: 'auto',
				'&:focus': {
					width: 'auto',
				},
			},
		},
	}));

	const [filtered, setFiltered] = useState([...clients]);
	const [searchText, setSearchText] = useState('');
	const classes = useStyles();
	const text = useRef('');

	useEffect(() => {
		if (!searchText) {
			setFiltered([
				...clients.sort((a, b) => a.name.localeCompare(b.name)),
			]);
		} else {
			const filteredList = filtered.filter(client => {
				const regex = new RegExp(`${searchText}`, 'gi'); // make text a global case insensitive regexp
				return client.name.match(regex) || client.email.match(regex); // match name or email
			});
			setFiltered([...filteredList]);
		}
	}, [searchText, clients]);

	const getFiltered = e => {
		if (text.current.value !== '') {
			setSearchText(e.target.value);
		} else {
			setSearchText('');
		}
	};

	return (
		<Fragment>
			<Toolbar
				className={classes.toolbar}
				position="static"
				variant="dense"
			>
				<div className={classes.search}>
					<div className={classes.searchIcon}>
						<SearchIcon />
					</div>
					<InputBase
						ref={text}
						placeholder="Search…"
						classes={{
							root: classes.inputRoot,
							input: classes.inputInput,
						}}
						inputProps={{ 'aria-label': 'search' }}
						onChange={getFiltered}
					/>
				</div>
				<AddClient />
			</Toolbar>
			{filtered.map(client => (
				<ClientCard key={client._id} client={client} />
			))}
			<PreviousItems />
			<EditClient />
			<DeleteClientDialog />
		</Fragment>
	);
};

Clients.propTypes = {
	clients: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
			phone: PropTypes.string.isRequired,
			add1: PropTypes.string.isRequired,
			add2: PropTypes.string,
			add3: PropTypes.string,
			postCode: PropTypes.string.isRequired,
			greeting: PropTypes.string.isRequired,
		})
	),
};

const mapStateToProps = state => ({
	clients: state.clients.clients,
});

export default connect(mapStateToProps)(Clients);
