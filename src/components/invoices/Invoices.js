import React, { Fragment, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import AddInvoice from './AddInvoice';

const Invoices = ({ invoices }) => {
	const useStyles = makeStyles(theme => ({
		toolbar: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyItems: 'space-between',
			flexGrow: 1,
			padding: theme.spacing(1),
			backgroundColor: '#fff',
			width: '100%'
		},
		search: {
			flexGrow: 1,
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
				width: 'auto',
				'&:focus': {
					width: 'auto'
				}
			}
		}
	}));

	const [filtered, setFiltered] = useState([...invoices]);
	const [searchText, setSearchText] = useState('');
	const classes = useStyles();
	const text = useRef('');

	useEffect(() => {
		if (!searchText) {
			setFiltered([...invoices.sort((b, a) => a.date.localeCompare(b.date))]);
		} else {
			const filteredList = filtered.filter(exp => {
				const regex = new RegExp(`${searchText}`, 'gi'); // make text a global case insensitive regexp
				return exp.category.match(regex) || exp.desc.match(regex); // match name or email
			});
			setFiltered([...filteredList]);
		}
	}, [searchText, invoices]);

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
				<AddInvoice />
			</Toolbar>
		</Fragment>
	);
};

Invoices.propTypes = {};

const mapStateToProps = state => ({
	invoices: state.invoices.invoices
});

export default connect(mapStateToProps)(Invoices);
