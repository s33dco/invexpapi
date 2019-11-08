/* eslint-disable react/require-default-props */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { DatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { titleCase } from '../../../../config/textFormat';

const useStyles = makeStyles(theme => ({
	select: {
		margin: theme.spacing(2, 0, 0),
		width: '100%',
	},
	datePicker: {
		margin: theme.spacing(2, 0),
		width: '100%',
	},
	textField: {
		marginLeft: '0',
		marginRight: '0',
		width: '100%',
	},
}));

const InvoiceDetails = props => {
	const classes = useStyles();
	const {
		selectedClient,
		clients,
		invoice,
		errorInvoice,
		handleChange,
		handleDateChange,
		handleClientChange,
		handleInvoiceNumber,
		handleDatePaidChange,
		useMileage,
		canSend,
	} = props;

	return (
		<Fragment>
			<TextField
				controlled="true"
				required
				placeholder="Invoice Number"
				label="Invoice Number"
				id="invNo"
				name="invNo"
				type="text"
				error={!(errorInvoice.invNo.length === 1)}
				helperText={
					errorInvoice.invNo.length > 1 ? errorInvoice.invNo : ''
				}
				value={invoice.invNo}
				onChange={handleInvoiceNumber}
				className={classes.textField}
				margin="normal"
			/>
			<div className={classes.datePicker}>
				<DatePicker
					disableFuture
					label="Invoice Date"
					value={invoice.date}
					onChange={handleDateChange}
					format="Do MMMM YYYY"
					animateYearScrolling
					error={!(errorInvoice.date.length === 1)}
					helperText={
						errorInvoice.date.length > 1 ? errorInvoice.date : ''
					}
				/>
			</div>
			<Select
				label="Choose Client"
				value={invoice.client}
				onChange={handleClientChange}
				onBlur={canSend}
				className={classes.select}
				displayEmpty
				inputProps={{
					name: 'client',
					id: 'client',
				}}
			>
				{selectedClient ? (
					<MenuItem
						value={selectedClient}
						disabled
						className={classes.textField}
					>
						{selectedClient.name}
					</MenuItem>
				) : (
					<MenuItem value="" disabled className={classes.textField}>
						Choose Client
					</MenuItem>
				)}

				{clients.map(c => (
					<MenuItem
						value={c}
						key={c._id}
						className={classes.textField}
					>
						{titleCase(c.name)}
					</MenuItem>
				))}
			</Select>
			{useMileage && (
				<TextField
					controlled="true"
					required
					error={!(errorInvoice.mileage.length === 1)}
					helperText={
						errorInvoice.mileage.length > 1
							? errorInvoice.mileage
							: ''
					}
					placeholder="Round number of miles driven"
					label="Round number of miles driven"
					id="mileage"
					name="mileage"
					type="text"
					value={invoice.mileage}
					onChange={handleChange}
					className={classes.textField}
					margin="normal"
					onBlur={canSend}
				/>
			)}
			<TextField
				controlled="true"
				required
				error={!(errorInvoice.message.length === 1)}
				placeholder="Message for Email"
				label="Message for Email"
				id="message"
				name="message"
				type="text"
				value={invoice.message}
				onChange={handleChange}
				className={classes.textField}
				margin="normal"
				onBlur={canSend}
				helperText={
					errorInvoice.message.length > 1 ? errorInvoice.message : ''
				}
			/>
			{invoice.paid && (
				<div className={classes.datePicker}>
					<DatePicker
						disableFuture
						label="Date Paid"
						value={invoice.datePaid}
						onChange={handleDatePaidChange}
						format="Do MMMM YYYY"
						animateYearScrolling
					/>
				</div>
			)}
		</Fragment>
	);
};

InvoiceDetails.propTypes = {
	selectedClient: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string,
		email: PropTypes.string,
		phone: PropTypes.string,
		add1: PropTypes.string,
		add2: PropTypes.string,
		add3: PropTypes.string,
		postCode: PropTypes.string,
		greeting: PropTypes.string,
	}),
	clients: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
			phone: PropTypes.string.isRequired,
			add1: PropTypes.string.isRequired,
			add2: PropTypes.string,
			add3: PropTypes.string,
			postCode: PropTypes.string.isRequired,
			greeting: PropTypes.string.isRequired,
		})
	).isRequired,

	invoice: PropTypes.shape({
		invNo: PropTypes.number.isRequired,
		mileage: PropTypes.number,
		message: PropTypes.string.isRequired,
		_id: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
		datePaid: PropTypes.string,
		paid: PropTypes.bool.isRequired,
		client: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
			phone: PropTypes.string.isRequired,
			add1: PropTypes.string.isRequired,
			add2: PropTypes.string,
			add3: PropTypes.string,
			postCode: PropTypes.string.isRequired,
			greeting: PropTypes.string.isRequired,
		}),
		business: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
			phone: PropTypes.string.isRequired,
			add1: PropTypes.string.isRequired,
			add2: PropTypes.string,
			add3: PropTypes.string,
			postCode: PropTypes.string.isRequired,
			bankName: PropTypes.string.isRequired,
			accountNo: PropTypes.string.isRequired,
			sortCode: PropTypes.string.isRequired,
			utr: PropTypes.string.isRequired,
			terms: PropTypes.string.isRequired,
			farewell: PropTypes.string.isRequired,
			contact: PropTypes.string.isRequired,
			useMileage: PropTypes.bool.isRequired,
		}),
		items: PropTypes.arrayOf(
			PropTypes.shape({
				date: PropTypes.string.isRequired,
				desc: PropTypes.string.isRequired,
				fee: PropTypes.string.isRequired,
				id: PropTypes.string.isRequired,
			})
		).isRequired,
	}).isRequired,

	errorInvoice: PropTypes.shape({
		invNo: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
		business: PropTypes.string.isRequired,
		client: PropTypes.string.isRequired,
		message: PropTypes.string.isRequired,
		mileage: PropTypes.string.isRequired,
	}),
	handleChange: PropTypes.func.isRequired,
	handleDateChange: PropTypes.func.isRequired,
	handleClientChange: PropTypes.func.isRequired,
	handleInvoiceNumber: PropTypes.func.isRequired,
	handleDatePaidChange: PropTypes.func.isRequired,
	useMileage: PropTypes.bool.isRequired,
	canSend: PropTypes.func.isRequired,
};

export default InvoiceDetails;
