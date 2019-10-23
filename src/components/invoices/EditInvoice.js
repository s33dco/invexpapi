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
	updateInvoice,
	clearCurrentInvoice,
	clearInvoiceErrors
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
		margin: theme.spacing(1)
	},
	extendedIcon: {
		marginRight: theme.spacing(1)
	}
}));

const EditInvoice = ({
	updateInvoice,
	clearInvoiceErrors,
	clearCurrentInvoice,
	error,
	clients,
	invoices,
	current,
	business
}) => {
	const classes = useStyles();
	const [invoice, setInvoice] = useState({
		invNo: '',
		date: moment().utc(),
		business: {},
		client: {},
		items: [],
		message: '',
		mileage: 0,
		paid: false,
		datePaid: '',
		items: []
	});
	const [errorInvoice, setErrorInvoice] = useState({
		invNo: '1',
		date: '1',
		business: '1',
		client: '1',
		message: '1',
		mileage: '1'
	});
	const [record, setRecord] = useState({ id: '' });
	const [open, setOpen] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [hasSent, setHasSent] = useState(false);
	const [inProcess, setInProcess] = useState(false);
	const [dbError, setDbError] = useState('');

	const { useMileage } = business;

	useEffect(() => {
		async function itemsErrors() {
			current.items
				.map(item => item.id)
				.map(i => {
					setErrorInvoice({ ...errorInvoice, [i]: { desc: '1', fee: '1' } });
				});
		}

		if (current && !inProcess) {
			const { _id, ...toUpdate } = current;
			setInvoice({ ...invoice, ...toUpdate });
			itemsErrors(invoice);
			setRecord({ ...record, id: _id.toString() });
			itemsErrors();
			setInProcess(true);
			setOpen(true);
		}

		if (error) {
			setHasSent(false);
			setDbError(error); // set form level error
			dealWithError(error);
			clearInvoiceErrors(); // set form level errors
			setDisabled(true); // disable sebd button on form
		}

		if (current && hasSent && !error && !dbError && !disabled) {
			handleClose();
		}
	}, [current, inProcess, error, current, hasSent, dbError]);

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
			// 	case category.test(error):
			// 		setFormErrors({ ...formErrors, email: error });
			// 		break;
			// 	case amount.test(error):
			// 		setFormErrors({ ...formErrors, amount: error });
			// 		break;
			// 	case date.test(error):
			// 		setFormErrors({ ...formErrors, amount: error });
			// 		break;
			default:
				clearForm();
		}
	};

	const clearForm = () => {
		setInvoice({
			invNo: '',
			date: moment().utc(),
			business: {},
			client: {},
			items: [],
			message: '',
			mileage: 0,
			paid: false,
			datePaid: ''
		});
		setErrorInvoice({
			invNo: '1',
			date: '1',
			business: '1',
			client: '1',
			message: '1',
			mileage: '1',
			items: '1',
			datePaid: '1'
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

	const onSubmit = async e => {
		e.preventDefault();
		invoice.items.forEach(item => {
			item.fee = parseFloat(item.fee).toFixed(2);
		});
		invoice.items.sort((a, b) => (a.date > b.date ? 1 : -1));

		const total = invoice.items.reduce((s, v) => {
			return s.add(v.fee);
		}, numeral(0));

		setHasSent(true);
		await updateInvoice(record.id, {
			...invoice,
			total: parseFloat(total._value).toFixed(2)
		});
	};

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

	const handleDatePaidChange = e => {
		setInvoice({ ...invoice, datePaid: e });
	};

	const handleInvoiceNumber = e => {
		setInvoice({ ...invoice, [e.target.name]: e.target.value });
		let message = '';
		if (usedInvNos.includes(parseInt(e.target.value))) {
			message = `You already have an invoice number ${e.target.value}`;
		}
		if (!e.target.value.match(checkNumber)) {
			message = 'just use digits for an invoice number';
		}
		message.length === 0
			? setErrorInvoice({ ...errorInvoice, [e.target.id]: '1' })
			: setErrorInvoice({ ...errorInvoice, [e.target.id]: message });
	};

	const handleChange = e => {
		let regExp;
		let message;
		switch (e.target.id) {
			case 'fee':
				regExp = checkMoney;
				message = "this fee doesn't look right";
				break;
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

	const onRadioToggle = e => {
		setInvoice({ ...invoice, [e.target.name]: e.target.value });
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setDbError('');
		clearForm();
		setInProcess(false);
		setHasSent(false);
		setDisabled(false);
		clearCurrentInvoice();
	};

	return (
		<div>
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
								Editing Invoice {invoice.invNo}
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
								selectedClient={invoice.client}
								clients={clients}
								invoice={invoice}
								errorInvoice={errorInvoice}
								handleChange={handleChange}
								handleInvoiceNumber={handleInvoiceNumber}
								handleDateChange={handleDateChange}
								handleClientChange={handleClientChange}
								useMileage={useMileage}
								canSend={canSend}
								handleDatePaidChange={handleDatePaidChange}
								onRadioToggle={onRadioToggle}
							/>

							<Typography className={classes.heading}>Invoice Items</Typography>

							{invoice.items.map(item => (
								<InvoiceItem
									item={item}
									key={item.id}
									invDate={invoice.date}
									updateChangedDateField={updateChangedDateField}
									updateChangedTextField={updateChangedTextField}
									deleteItem={deleteItem}
									errorInvoice={errorInvoice}
									canSend={canSend}
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
									Update
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

EditInvoice.propTypes = {};

const mapStateToProps = state => ({
	current: state.invoices.current,
	error: state.invoices.error,
	clients: state.clients.clients,
	invoices: state.invoices.invoices,
	business: state.business.business
});

export default connect(
	mapStateToProps,
	{ updateInvoice, clearInvoiceErrors, clearCurrentInvoice }
)(EditInvoice);
