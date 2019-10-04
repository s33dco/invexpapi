import React, { Fragment, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import AddInvoice from './AddInvoice';
import InvoiceCard from './InvoiceCard';
// import EditInvoice from './EditInvoice';
import DeleteInvoiceDialog from './DeleteInvoiceDialog';

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
			width: '100%',
			borderRadius: theme.spacing(2),
			boxShadow: theme.shadows[1],
			margin: theme.spacing(1, 0)
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
			setFiltered([...invoices.sort((b, a) => (a.invNo > b.invNo ? 1 : -1))]);
		} else {
			const filteredList = filtered.filter(inv => {
				const regex = new RegExp(`${searchText}`, 'gi');
				return inv.client.name.match(regex);
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
						placeholder="Client Name.."
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
			{filtered.map(inv => (
				<InvoiceCard key={inv._id} invoice={inv} />
			))}
			{/* <EditInvoice /> */}
			<DeleteInvoiceDialog />
		</Fragment>
	);
};

Invoices.propTypes = {};

const mapStateToProps = state => ({
	invoices: state.invoices.invoices
});

export default connect(mapStateToProps)(Invoices);
