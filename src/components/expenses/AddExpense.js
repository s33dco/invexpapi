// import React, { useState, useEffect } from 'react';
// // import { withRouter } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';
// import Modal from '@material-ui/core/Modal';
// import Backdrop from '@material-ui/core/Backdrop';
// import Fab from '@material-ui/core/Fab';
// import AddIcon from '@material-ui/icons/Add';
// import Button from '@material-ui/core/Button';
// import Fade from '@material-ui/core/Fade';
// import Container from '@material-ui/core/Container';
// import Typography from '@material-ui/core/Typography';
// import TextField from '@material-ui/core/TextField';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import { addExpense, clearExpenseErrors } from '../../actions/expensesActions';
// import categories from '../../../server/models/expense';
// import {
// 	businessName,
// 	checkName,
// 	checkPhoneNumber,
// 	checkPostcode,
// 	simpleEmail
// } from '../../../config/regexps';

// const useStyles = makeStyles(theme => ({
// 	modal: {
// 		display: 'flex',
// 		alignItems: 'center',
// 		justifyContent: 'center'
// 	},
// 	paper: {
// 		backgroundColor: theme.palette.background.paper,
// 		border: '2px solid #000',
// 		boxShadow: theme.shadows[5],
// 		padding: theme.spacing(2, 4, 3),
// 		width: '90vw',
// 		maxHeight: '90vh',
// 		overflowY: 'auto'
// 	},
// 	textField: {
// 		marginLeft: '0',
// 		marginRight: '0',
// 		width: '100%'
// 	},
// 	form: {
// 		margin: '0',
// 		width: '100%'
// 	},
// 	divider: {
// 		margin: '1vh 0'
// 	},
// 	fab: {
// 		margin: theme.spacing(1)
// 	},
// 	extendedIcon: {
// 		marginRight: theme.spacing(1)
// 	}
// }));

// const AddExpense = ({ addExpense, clearExpenseErrors, error, expenses }) => {
// 	const classes = useStyles();
// 	const [open, setOpen] = useState(false);
// 	const [disabled, setDisabled] = useState(true);
// 	const [dbError, setDbError] = useState('');
// 	const [expense, setExpense] = useState({
// 		date: '',
// 		category: '',
// 		amount: '',
// 		desc: ''
// 	});
// 	const [formErrors, setFormErrors] = useState({
// 		date: '1',
// 		category: '1',
// 		amount: '1',
// 		desc: '1'
// 	});

// 	useEffect(() => {
// 		if (error) {
// 			// if api error
// 			setDbError('Please take another look...'); // set form level error
// 			setFormErrors({ ...formErrors, email: error }); // set field level error
// 			clearClientErrors(); // clear api level error
// 		}
// 		if (!error && !dbError && !disabled) {
// 			// no api or form errors and form enabled
// 			clearForm();
// 			handleClose();
// 		}
// 		// eslint - disable - next - line;
// 	}, [error, expenses]); // check for changes from api, api error and change in record being updated

// 	const clearForm = () => {
// 		setDisabled(true);
// 		setExpense({
// 			date: '',
// 			category: '',
// 			amount: '',
// 			desc: ''
// 		});
// 		setFormErrors({
// 			date: '0',
// 			category: '0',
// 			amount: '0',
// 			desc: '0'
// 		});
// 	};

// 	const canSend = () => {
// 		if (Array.from(new Set(Object.values(formErrors))).length === 1) {
// 			// if no field level errors
// 			setDisabled(false); // enable form
// 			setDbError(''); // clear form level error
// 		} else {
// 			setDisabled(true); // if field errors disable form
// 		}
// 	};

// 	const onSubmit = e => {
// 		e.preventDefault();
// 		addExpense({ ...expense });
// 	};

// 	const handleChange = () => {};

// 	// const handleChange = e => {
// 	// 	let regExp;
// 	// 	let message;
// 	// 	switch (e.target.id) {
// 	// 		case 'email':
// 	// 			regExp = simpleEmail;
// 	// 			message = "the email address doesn't look right";
// 	// 			break;
// 	// 		case 'postCode':
// 	// 			regExp = checkPostcode;
// 	// 			message = "the postcode doesn't look right";
// 	// 			break;
// 	// 		case 'phone':
// 	// 			regExp = checkPhoneNumber;
// 	// 			message =
// 	// 				'check the phone number - just the right anount of digits needed';
// 	// 			break;
// 	// 		case 'name':
// 	// 		case 'greeting':
// 	// 			regExp = businessName;
// 	// 			message = 'Just word characters please';
// 	// 			break;
// 	// 		default:
// 	// 			regExp = checkName;
// 	// 			message = 'no weird characters please';
// 	// 	}
// 	// 	setExpense({
// 	// 		...expense,
// 	// 		[e.target.id]: e.target.value
// 	// 	});
// 	// 	if (e.target.value.match(regExp)) {
// 	// 		setFormErrors({
// 	// 			...formErrors,
// 	// 			[e.target.id]: '1'
// 	// 		});
// 	// 	} else {
// 	// 		setFormErrors({
// 	// 			...formErrors,
// 	// 			[e.target.id]: message
// 	// 		});
// 	// 	}
// 	// };

// 	const handleOpen = () => {
// 		setOpen(true);
// 	};

// 	const handleClose = () => {
// 		setOpen(false);
// 	};

// 	return (
// 		<div>
// 			<Fab
// 				aria-label="add"
// 				className={classes.fab}
// 				color="primary"
// 				onClick={handleOpen}
// 				size="large"
// 				variant="extended"
// 			>
// 				<AddIcon className={classes.extendedIcon} /> Expense
// 			</Fab>
// 			<Modal
// 				aria-labelledby="modal-title"
// 				aria-describedby="modal-description"
// 				className={classes.modal}
// 				open={open}
// 				onClose={handleClose}
// 				closeAfterTransition
// 				BackdropComponent={Backdrop}
// 				BackdropProps={{
// 					timeout: 500
// 				}}
// 			>
// 				<Fade in={open}>
// 					<div className={classes.paper}>
// 						<Container component="form" className={classes.form}>
// 							<Typography variant="h5" component="h1" align="center">
// 								Add An Expense
// 							</Typography>
// 							{dbError && (
// 								<Typography
// 									variant="subtitle2"
// 									component="h4"
// 									align="center"
// 									color="error"
// 								>
// 									{dbError}
// 								</Typography>
// 							)}

// 							<div>
// 								<Button
// 									type="submit"
// 									variant="contained"
// 									color="primary"
// 									onClick={onSubmit}
// 									disabled={disabled}
// 								>
// 									Add Expense
// 								</Button>
// 							</div>
// 							{dbError && (
// 								<Typography
// 									variant="subtitle2"
// 									component="h4"
// 									align="center"
// 									color="error"
// 								>
// 									{dbError}
// 								</Typography>
// 							)}
// 						</Container>
// 					</div>
// 				</Fade>
// 			</Modal>
// 		</div>
// 	);
// };

// AddExpense.propTypes = {};

// const mapStateToProps = state => ({
// 	expenses: state.expenses.expenses,
// 	error: state.expenses.error
// });

// export default connect(
// 	mapStateToProps,
// 	{ addExpense, clearExpenseErrors }
// )(AddExpense);
