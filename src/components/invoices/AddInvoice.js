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
import InvoiceDetails from './InvoiceDetails';
import InvoiceItem from './InvoiceItem';
import uuid from 'uuid/v4'
import { addInvoice, clearInvoiceErrors } from '../../actions/invoicesActions';
import { businessName, checkMoney } from '../../../config/regexps';

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

const AddInvoice = ({
	addInvoice,
	clearInvoiceErrors,
	error,
	invoices,
	clients,
	business
}) => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [dbError, setDbError] = useState('');
	const [invoice, setInvoice] = useState({
		invNo: '1',
		date: moment().utc(),
		business: { ...business },
		client: {},
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
		items: '0',
		message: '0',
		mileage: '1'
	});
	// const [items, setItems] = useState([]);
	// const [errorItems, setErrorItems] = useState([]);
	const {useMileage} = invoice.business


	useEffect(() => {
		if (error) {
			// if api error
			setDbError(error); // set form level error
			dealWithError(error); // set form level errors
			clearInvoiceErrors(); // clear api level error
		}
		if (!error && !dbError && !disabled) {
			// no api or form errors and form enabled
			handleClose();
		}
		// eslint - disable - next - line;
	}, [error, invoices, invoice]); // check for changes from api, api error and change in record being updated

	// const dealWithError = error => {
	// 	const desc = /desc/;
	// 	const amount = /amount/;
	// 	const category = /category/;
	// 	const date = /date/;
	// 	switch (true) {
	// 		case desc.test(error):
	// 			setFormErrors({ ...formErrors, desc: error });
	// 			break;
	// 		case category.test(error):
	// 			setFormErrors({ ...formErrors, email: error });
	// 			break;
	// 		case amount.test(error):
	// 			setFormErrors({ ...formErrors, amount: error });
	// 			break;
	// 		case date.test(error):
	// 			setFormErrors({ ...formErrors, amount: error });
	// 			break;
	// 		default:
	// 			clearForm();
	// 	}
	// };
	const clearForm = () => {
		// setDisabled(true);
		// setInvoice({
		// 	step: 0,
		// 	invNo: '1',
		// 	date: moment().utc(),
		// 	client: {},
		// 	business: { ...business },
		// 	message: '',
		// 	paid: false,
		// 	items: []
		// });
		// setFormErrors({
		// 	invNo: '1',
		// 	date: '1',
		// 	business: '1',
		// 	client: '0',
		// 	message: '0',
		// 	paid: '1',
		// 	items: '0'
		// });
	};
	const canSend = () => {
		if (Array.from(new Set(Object.values(formErrors))).length === 1) {
			// if no field level errors
			setDisabled(false); // enable form
			setDbError(''); // clear form level error
		} else {
			setDisabled(true); // if field errors disable form
		}
	};
	const onSubmit = async e => {
		e.preventDefault();
		const newInvoice = {
			...invoice
		};
		console.log(newInvoice)
		await addInvoice(newInvoice);
	};

	const handleClientChange = e => {
		setInvoice({ ...invoice, client: e.target.value });
	};

	const handleDateChange = e => {
		setInvoice({ ...invoice, date: e });
	};

	const handleChange = e => {
		let regExp;
		let message;
		switch (e.target.id) {
			case 'amount':
				regExp = checkMoney;
				message = 'the amount looks wrong';
				break;
			default:
				regExp = businessName;
				message = 'no weird character please';
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
			items : [
...invoice.items.map(item => item.id === id ? { ...item, date : e } : item )
			]
		}
		)
	};

	const updateChangedTextField = id => e => {
		setInvoice({
			...invoice,
			items: [
...invoice.items.map(item => item.id === id? { ...item, [e.target.name] : e.target.value } : item )]
		});
	}

		const deleteItem = id => {
		setInvoice({
			...invoice,
			items: [
...invoice.items.filter(item => item.id === id ?  null : item )]

		});
		}

	const addNewItem = item => {
		setInvoice({...invoice, items :[...invoice.items, item]})
		setShowAddItem(false)
	}

	const addAnItem = () => {
		console.log({...invoice})
		setInvoice({ ...invoice, items: [...invoice.items, 
				{
			date: moment().utc(),
			desc: '',
			amount: '',
			id: uuid()
				}
		]
	})
	}

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
		setDbError('');
		clearForm();
	};

	return (
		<div>
			<Fab
				aria-label="add"
				className={classes.fab}
				color="primary"
				onClick={handleOpen}
				size="large"
				variant="extended"
			>
				<AddIcon className={classes.extendedIcon} /> Invoice
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
									handleDateChange={handleDateChange}
									handleClientChange={handleClientChange}
									useMileage={invoice.useMileage}
								/>
								{invoice.items.length > 0 && <Typography className={classes.heading}>Invoice Items</Typography>}
								{invoice.items.map(item => (
									<InvoiceItem
										item={item}
										key={item.id}
										updateChangedDateField={updateChangedDateField}
										updateChangedTextField={updateChangedTextField}
										deleteItem={deleteItem}
									/>
								))}

							<Container className={classes.buttonWrapper}>
								<Button
									type="button"
									variant="contained"
									color="primary"
									onClick={addAnItem}
									disabled={false}
								>
									Add Item
								</Button>

								<Button
									type="submit"
									variant="contained"
									color="primary"
									onClick={onSubmit}
									disabled={false}
								>
									Save
								</Button>
							</Container>
							
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
	business: state.business.business
});

export default connect(
	mapStateToProps,
	{ addInvoice, clearInvoiceErrors }
)(AddInvoice);
