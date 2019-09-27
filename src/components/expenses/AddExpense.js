import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { DatePicker } from '@material-ui/pickers';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { addExpense, clearExpenseErrors } from '../../actions/expensesActions';
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

const AddExpense = ({
	addExpense,
	clearExpenseErrors,
	error,
	expenses,
	options
}) => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [dbError, setDbError] = useState('');
	const [expense, setExpense] = useState({
		date: moment(),
		category: '',
		amount: '',
		desc: ''
	});
	const [formErrors, setFormErrors] = useState({
		date: '1',
		category: '0',
		desc: '0',
		amount: '0'
	});

	useEffect(() => {
		if (error) {
			// if api error
			setDbError(error); // set form level error
			dealWithError(error); // set form level errors
			clearExpenseErrors(); // clear api level error
		}
		if (!error && !dbError && !disabled) {
			// no api or form errors and form enabled
			handleClose();
		}
		// eslint - disable - next - line;
	}, [error, expenses]); // check for changes from api, api error and change in record being updated

	const dealWithError = error => {
		const desc = /desc/;
		const amount = /amount/;
		const category = /category/;
		const date = /date/;
		switch (true) {
			case desc.test(error):
				setFormErrors({ ...formErrors, desc: error });
				break;
			case category.test(error):
				setFormErrors({ ...formErrors, email: error });
				break;
			case amount.test(error):
				setFormErrors({ ...formErrors, amount: error });
				break;
			case date.test(error):
				setFormErrors({ ...formErrors, amount: error });
				break;
			default:
				clearForm();
		}
	};
	const clearForm = () => {
		setDisabled(true);
		setExpense({
			date: moment(),
			category: '',
			amount: '',
			desc: ''
		});
		setFormErrors({
			date: '1',
			category: '0',
			amount: '0',
			desc: '0'
		});
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
	const onSubmit = e => {
		e.preventDefault();
		const formattedAmount = parseFloat(expense.amount).toFixed(2);
		addExpense({
			...expense,
			amount: formattedAmount
		});
	};

	const handleCategoryChange = e => {
		setExpense({ ...expense, category: e.target.value });

		if (options.includes(e.target.value)) {
			setFormErrors({
				...formErrors,
				category: '1'
			});
		} else {
			setFormErrors({
				...formErrors,
				category: 'select an option from list'
			});
		}
	};
	const handleDateChange = e => {
		setExpense({ ...expense, date: e });
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

		setExpense({ ...expense, [e.target.name]: e.target.value });

		if (e.target.value.match(regExp)) {
			setFormErrors({
				...formErrors,
				[e.target.id]: '1'
			});
		} else {
			setFormErrors({
				...formErrors,
				[e.target.id]: message
			});
		}
	};
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
				<AddIcon className={classes.extendedIcon} /> Expense
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
								Add Expense
							</Typography>
							{dbError && (
								<Typography
									variant="subtitle2"
									component="h4"
									align="center"
									color="error"
								>
									Please take another look
								</Typography>
							)}
							<div className={classes.datePicker}>
								<DatePicker
									disableFuture
									error={!(formErrors.date.length === 1)}
									value={expense.date}
									onChange={handleDateChange}
									onBlur={canSend}
									format="Do MMMM YYYY"
									animateYearScrolling
								/>
							</div>
							<Select
								label="Choose Category"
								value={expense.category}
								error={!(formErrors.category.length === 1)}
								onChange={handleCategoryChange}
								onBlur={canSend}
								className={classes.select}
								displayEmpty
								inputProps={{
									name: 'category',
									id: 'category'
								}}
							>
								<MenuItem value="" disabled className={classes.textField}>
									Choose Category
								</MenuItem>
								{options.map(cat => (
									<MenuItem value={cat} key={cat} className={classes.textField}>
										{cat}
									</MenuItem>
								))}
							</Select>
							<div>
								<TextField
									controlled="true"
									required
									error={!(formErrors.desc.length === 1)}
									placeholder="Description"
									label="Description"
									id="desc"
									name="desc"
									type="text"
									value={expense.desc}
									onChange={handleChange}
									onBlur={canSend}
									className={classes.textField}
									margin="normal"
									helperText={formErrors.desc.length > 1 ? formErrors.desc : ''}
								/>
								<TextField
									controlled="true"
									required
									error={!(formErrors.amount.length === 1)}
									placeholder="Amount"
									label="Amount"
									id="amount"
									name="amount"
									type="text"
									value={expense.amount}
									onChange={handleChange}
									onBlur={canSend}
									className={classes.textField}
									margin="normal"
									helperText={
										formErrors.amount.length > 1 ? formErrors.amount : ''
									}
								/>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									onClick={onSubmit}
									disabled={false}
								>
									Add Expense
								</Button>
							</div>
						</Container>
					</div>
				</Fade>
			</Modal>
		</div>
	);
};

AddExpense.propTypes = {};

const mapStateToProps = state => ({
	expenses: state.expenses.expenses,
	error: state.expenses.error,
	options: state.expenses.categories.selectOptions
});

export default connect(
	mapStateToProps,
	{ addExpense, clearExpenseErrors }
)(AddExpense);
