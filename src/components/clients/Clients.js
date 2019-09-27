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
import DeleteClientDialog from './DeleteClientDialog';

const Clients = ({ clients }) => {
	const useStyles = makeStyles(theme => ({
		toolbar: {
			flexGrow: 1,
			backgroundColor: '#fff'
		},
		search: {
			position: 'relative',
			borderRadius: theme.shape.borderRadius,
			backgroundColor: fade(theme.palette.common.white, 0.15),
			'&:hover': {
				backgroundColor: fade(theme.palette.common.white, 0.25)
			},
			marginLeft: 0,
			width: '100%',
			[theme.breakpoints.up('sm')]: {
				marginLeft: theme.spacing(1),
				width: 'auto'
			}
		},
		searchIcon: {
			width: theme.spacing(7),
			height: '100%',
			position: 'absolute',
			pointerEvents: 'none',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		},
		inputRoot: {
			color: 'inherit'
		},
		inputInput: {
			padding: theme.spacing(1, 1, 1, 7),
			transition: theme.transitions.create('width'),
			width: '100%',
			[theme.breakpoints.up('sm')]: {
				width: 120,
				'&:focus': {
					width: 200
				}
			}
		}
	}));

	const [filtered, setFiltered] = useState([...clients]);
	const [searchText, setSearchText] = useState('');
	const classes = useStyles();
	const text = useRef('');

	useEffect(() => {
		if (!searchText) {
			setFiltered([...clients.sort((a, b) => a.name.localeCompare(b.name))]);
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
			<Toolbar className={classes.toolbar} position="static" variant="dense">
				<div className={classes.search}>
					<div className={classes.searchIcon}>
						<SearchIcon />
					</div>
					<InputBase
						ref={text}
						placeholder="Search…"
						classes={{
							root: classes.inputRoot,
							input: classes.inputInput
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
			<EditClient />
			<DeleteClientDialog />
		</Fragment>
	);
};

Clients.propTypes = {};

const mapStateToProps = state => ({
	clients: state.clients.clients
});

export default connect(mapStateToProps)(Clients);
