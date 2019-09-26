import React, { useEffect, useRef } from 'react';
// import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { connect } from 'react-redux';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import {
	filteredClients,
	clearFilteredClients
} from '../../actions/clientsActions';

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

const SearchBar = ({
	filtered,
	clients,
	filteredClients,
	clearFilteredClients
}) => {
	const classes = useStyles();
	const text = useRef('');
	useEffect(() => {}, [filtered]);

	const getFiltered = e => {
		e.preventDefault();
		filteredClients(text);
	};

	return (
		<Toolbar className={classes.toolbar} position="static">
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
		</Toolbar>
	);
};

SearchBar.propTypes = {};

const mapStateToProps = state => ({
	clients: state.clients.clients,
	filtered: state.clients.filtered
});

export default connect(
	mapStateToProps,
	{ filteredClients, clearFilteredClients }
)(SearchBar);
