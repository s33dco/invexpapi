import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import uuid from 'uuid/v4';
import InvoiceDetails from './InvoiceDetails';
import InvoiceItem from './InvoiceItem';
import {
	addInvoice,
	clearInvoiceErrors,
	clearCurrentInvoice
} from '../../actions/invoicesActions';
import { businessName, checkMoney, checkNumber } from '../../../config/regexps';

const useStyles = makeStyles(theme => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		width: '90vw',
		maxHeight: '90vh',
		overflowY: 'auto'
	},
	buttonWrapper: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: theme.spacing(1, 0, 3),
		padding: theme.spacing(2, 1),
		borderRadius: theme.spacing(2)
	},
	'@media (min-width: 600px)': {
		paper: {
			width: '50vw'
		}
	},
	heading: {
		margin: theme.spacing(4, 0, 2),
		width: '100%'
	},
	select: {
		margin: theme.spacing(2, 0, 0),
		width: '100%'
	},
	datePicker: {
		margin: theme.spacing(2, 0),
		width: '100%'
	},
	textField: {
		marginLeft: '0',
		marginRight: '0',
		width: '100%'
	},
	form: {
		margin: '0',
		width: '100%'
	},
	divider: {
		margin: '1vh 0'
	},
	fab: {
		margin: theme.spacing(1),
		padding: theme.spacing(0.5)
	},
	extendedIcon: {
		marginRight: theme.spacing(0.25)
	}
}));

const AddInvoice = ({
	addInvoice,
	clearInvoiceErrors,
	clearCurrentInvoice,
	error,
	invoices,
	clients,
	business,
	lastInv
}) => {
	const nextInvNumber = () => (!lastInv ? 1 : lastInv + 1);
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [isSent, setIsSent] = useState(false);
	const [dbError, setDbError] = useState('');
	const [invoice, setInvoice] = useState({
		invNo: nextInvNumber(),
		date: moment().utc(),
		business: { ...business },
		client: '',
		items: [],
		message: '',
		mileage: 0,
		paid: false
	});
	const [errorInvoice, setErrorInvoice] = useState({
		invNo: '1',
		date: '1',
		business: '1',
		client: '0',
		message: '0',
		mileage: '1',
		items: '0'
	});
	const { useMileage } = invoice.business;

	useEffect(() => {
		if (error) {
			// if api error
			setIsSent(false);
			setDbError(error); // set form level error
			dealWithError(error); // set form level errors
			clearInvoiceErrors(); // clear api level error
		}
		if (!error && !dbError && !disabled && isSent) {
			// no api or form errors and form enabled
			handleClose();
		}
		// eslint - disable - next - line;
	}, [error, invoices, invoice]);

	// errors from api
	const dealWithError = error => {
		const invNo = /invNo/;
		const date = /date/;
		const client = /client/;
		const useMileage = /useMileage/;
		const message = /message/;
		const items = /items/;

		// const category = /category/;
		// const date = /date/;
		switch (true) {
			case invNo.test(error):
				setErrorInvoice({ ...errorInvoice, invNo: error });
				break;
			case date.test(error):
				setErrorInvoice({ ...errorInvoice, date: error });
				break;
			case client.test(error):
				setErrorInvoice({ ...errorInvoice, client: error });
				break;
			case useMileage.test(error):
				setErrorInvoice({ ...errorInvoice, useMileage: error });
				break;
			case message.test(error):
				setErrorInvoice({ ...errorInvoice, message: error });
				break;
			case items.test(error):
				break;
			default:
		}
	};

	// form functions

	const onSubmit = async e => {
		e.preventDefault();
		invoice.items.forEach(item => {
			item.fee = parseFloat(item.fee).toFixed(2);
		});
		invoice.items.sort((a, b) => (a.date > b.date ? 1 : -1));

		const total = invoice.items.reduce((s, v) => {
			return s.add(v.fee);
		}, numeral(0));

		setIsSent(true);

		await addInvoice({
			...invoice,
			total: parseFloat(total._value).toFixed(2)
		});
	};

	const clearForm = () => {
		setInvoice({
			invNo: nextInvNumber(),
			date: moment().utc(),
			business: { ...business },
			client: '',
			items: [],
			message: '',
			mileage: 0,
			paid: false
		});
		setErrorInvoice({
			invNo: '1',
			date: '1',
			business: '1',
			client: '0',
			message: '0',
			mileage: '1',
			items: '0'
		});
	};

	const canSend = () => {
		const allOk = Object.values(errorInvoice)
			.flat()
			.map(i => (i instanceof Object ? Object.values(i) : i))
			.flat();

		if (Array.from(new Set(Object.values(allOk))).length === 1) {
			// if no field level errors
			setDisabled(false); // enable form
			setDbError(''); // clear form level error
		} else {
			setDisabled(true); // if field errors disable form
		}
	};

	// invoice details
	const handleClientChange = e => {
		setInvoice({ ...invoice, client: e.target.value });
		setErrorInvoice({
			...errorInvoice,
			client: '1'
		});
	};

	const handleDateChange = e => {
		setInvoice({ ...invoice, date: e });
	};

	const handleInvoiceNumber = e => {
		setInvoice({ ...invoice, [e.target.name]: e.target.value });
		let message = '';
		if (!e.target.value.match(checkNumber)) {
			message = 'just use digits for an invoice number';
		}
		if (usedInvNos.includes(parseInt(e.target.value))) {
			message = `You already have an invoice number ${e.target.value}`;
		}

		message.length === 0
			? setErrorInvoice({ ...errorInvoice, [e.target.id]: '1' })
			: setErrorInvoice({ ...errorInvoice, [e.target.id]: message });
	};

	const handleChange = e => {
		let regExp;
		let message;
		switch (e.target.id) {
			case 'mileage':
				regExp = checkNumber;
				message = 'just digits';
				break;
			default:
				regExp = businessName;
				message = 'no weird characters please';
		}

		setInvoice({ ...invoice, [e.target.name]: e.target.value });

		if (e.target.value.match(regExp)) {
			setErrorInvoice({
				...errorInvoice,
				[e.target.id]: '1'
			});
		} else {
			setErrorInvoice({
				...errorInvoice,
				[e.target.id]: message
			});
		}
	};

	// invoice items
	const updateChangedDateField = id => e => {
		setInvoice({
			...invoice,
			items: [
				...invoice.items.map(item =>
					item.id === id ? { ...item, date: e } : item
				)
			]
		});
	};

	const updateChangedTextField = id => e => {
		let regExp;
		let message = "this can't be blank";
		switch (e.target.name) {
			case 'fee':
				regExp = checkMoney;
				message = 'the amount looks wrong';
				break;
			default:
				regExp = businessName;
				message = 'need a description using standard characters';
		}

		setInvoice({
			...invoice,
			items: [
				...invoice.items.map(item =>
					item.id === id ? { ...item, [e.target.name]: e.target.value } : item
				)
			]
		});

		const prevErrors = errorInvoice[id];

		if (e.target.value.match(regExp) && e.target.value) {
			setErrorInvoice({
				...errorInvoice,
				[id]: { ...prevErrors, [e.target.name]: '1' }
			});
		} else {
			setErrorInvoice({
				...errorInvoice,
				[id]: { ...prevErrors, [e.target.name]: message }
			});
		}
	};

	const deleteItem = id => {
		setInvoice({
			...invoice,
			items: [...invoice.items.filter(item => (item.id === id ? null : item))]
		});
	};

	const addAnItem = () => {
		const newId = uuid();
		setInvoice({
			...invoice,
			items: [
				...invoice.items,
				{
					date: moment().utc(),
					desc: '',
					fee: '',
					id: newId
				}
			]
		});
		setErrorInvoice({
			...errorInvoice,
			items: '1',
			[newId]: {
				desc: '0',
				fee: '0'
			}
		});
	};

	// open and close form
	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setIsSent(false);
		setDbError('');
		clearForm();
		clearCurrentInvoice();
	};

	return (
		<div>
			<Fab
				aria-label="add"
				className={classes.fab}
				color="primary"
				onClick={handleOpen}
				size="small"
				variant="extended"
				disabled={!(business.name && clients.length > 0)}
			>
				<AddIcon className={classes.extendedIcon} />
				Invoice
			</Fab>
			<Modal
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
				className={classes.modal}
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500
				}}
			>
				<Fade in={open}>
					<div className={classes.paper}>
						<Container component="form" className={classes.form}>
							<Typography variant="h5" component="h1" align="center">
								Make An Invoice
							</Typography>
							{dbError && (
								<Typography
									variant="subtitle2"
									component="h4"
									align="center"
									color="error"
								>
									Please take another look, {dbError}
								</Typography>
							)}
							<InvoiceDetails
								clients={clients}
								invoice={invoice}
								errorInvoice={errorInvoice}
								handleChange={handleChange}
								handleInvoiceNumber={handleInvoiceNumber}
								handleDateChange={handleDateChange}
								handleClientChange={handleClientChange}
								useMileage={business.useMileage}
								canSend={canSend}
							/>
							{invoice.items.length > 0 && (
								<Typography className={classes.heading}>
									Invoice Items
								</Typography>
							)}
							{invoice.items.map(item => (
								<InvoiceItem
									item={item}
									key={item.id}
									selectedClient={false}
									updateChangedDateField={updateChangedDateField}
									updateChangedTextField={updateChangedTextField}
									deleteItem={deleteItem}
									errorInvoice={errorInvoice}
									canSend={canSend}
									invDate={invoice.date}
								/>
							))}

							<Container className={classes.buttonWrapper}>
								<Button
									type="button"
									variant="contained"
									color="primary"
									onClick={addAnItem}
								>
									Add Item
								</Button>

								<Button
									type="submit"
									variant="contained"
									color="primary"
									onClick={onSubmit}
									disabled={disabled}
								>
									Create
								</Button>
							</Container>
							<div>
								{dbError && (
									<Typography
										variant="subtitle2"
										component="h4"
										align="center"
										color="error"
									>
										Please take another look, {dbError}
									</Typography>
								)}
							</div>
						</Container>
					</div>
				</Fade>
			</Modal>
		</div>
	);
};

AddInvoice.propTypes = {};

const mapStateToProps = state => ({
	invoices: state.invoices.invoices,
	error: state.invoices.error,
	clients: state.clients.clients,
	business: state.business.business,
	lastInv: state.invoices.invoices
		.map(i => i.invNo)
		.sort((a, b) => (a > b ? 1 : -1))
		.pop()
});

export default connect(
	mapStateToProps,
	{ addInvoice, clearInvoiceErrors, clearCurrentInvoice }
)(AddInvoice);
