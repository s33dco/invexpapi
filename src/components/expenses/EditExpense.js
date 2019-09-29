import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { DatePicker } from '@material-ui/pickers';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	updateExpense,
	clearExpenseErrors,
	clearCurrentExpense
} from '../../actions/expensesActions';
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
	'@media (min-width: 600px)': {
		paper: {
			width: '50vw'
		}
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
	}
}));

const EditExpense = ({
	options,
	updateExpense,
	clearExpenseErrors,
	clearCurrentExpense,
	error,
	current
}) => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [dbError, setDbError] = useState('');
	const [hasSent, setHasSent] = useState(false);
	const [inProcess, setInProcess] = useState(false);
	const [record, setRecord] = useState({ id: '' });
	const [expense, setExpense] = useState({
		date: moment(),
		category: '',
		amount: '',
		desc: ''
	});
	const [formErrors, setFormErrors] = useState({
		date: '1',
		category: '1',
		desc: '1',
		amount: '1'
	});

	useEffect(() => {
		if (current && !inProcess) {
			setOpen(true);
			const { _id, ...toUpdate } = current;
			console.log('initial state of expense ->', toUpdate);
			const objId = _id.toString();
			setRecord({ ...record, id: objId });
			setExpense({ ...expense, ...toUpdate });
			setInProcess(true);
		}

		if (error) {
			setHasSent(false);
			setDbError(error); // set form level error
			dealWithError(error);
			clearExpenseErrors(); // set form level errors
			setDisabled(true); // disable sebd button on form
		}

		if (current && hasSent && !error && !dbError && !disabled) {
			handleClose();
		}
		// eslint - disable - next - line;
	}, [error, current, hasSent, inProcess, dbError]);

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
				resetForm();
		}
	};

	const resetForm = () => {
		setDisabled(true);
		setHasSent(false);
		setRecord({ ...record, id: '' });
		setExpense({
			date: moment(),
			category: '',
			amount: '',
			desc: ''
		});
		setFormErrors({
			date: '1',
			category: '1',
			amount: '1',
			desc: '1'
		});
	};
	const resetFormErrors = async () => {
		await clearExpenseErrors();
		setDbError('');
	};
	const handleClose = () => {
		setOpen(false);
		resetFormErrors();
		resetForm();
		clearCurrentExpense();
		setInProcess(false);
	};
	const canSend = () => {
		if (Array.from(new Set(Object.values(formErrors))).length === 1) {
			// if no field level errors
			setDisabled(false); // enable send button on form
			setDbError(''); // clear form level error
		} else {
			setDisabled(true); // if field errors disable form
		}
	};
	const onSubmit = async e => {
		e.preventDefault();
		const formattedData = {
			...expense,
			amount: parseFloat(expense.amount).toFixed(2)
		};
		await updateExpense(record.id, formattedData);
		setHasSent(true);
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
		setExpense({ ...expense, date: moment(e).toISOString() });
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

	return (
		<Fragment>
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
							<div>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									onClick={onSubmit}
									disabled={disabled}
								>
									Update
								</Button>
							</div>
						</Container>
					</div>
				</Fade>
			</Modal>
		</Fragment>
	);
};

EditExpense.propTypes = {};

const mapStateToProps = state => ({
	current: state.expenses.current,
	error: state.expenses.error,
	options: state.expenses.categories.selectOptions
});

export default connect(
	mapStateToProps,
	{ updateExpense, clearExpenseErrors, clearCurrentExpense }
)(EditExpense);
