import React, { Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { DatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import titleCase from '../../../config/titleCase';

const useStyles = makeStyles(theme => ({
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
	}
}));

const InvoiceDetails = props => {
	const classes = useStyles();
	const {
		clients,
		invoice,
		errorInvoice,
		handleChange,
		handleDateChange,
		handleClientChange,
		handleInvoiceNumber,
		useMileage,
		canSend
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
				helperText={errorInvoice.invNo.length > 1 ? errorInvoice.invNo : ''}
				value={invoice.invNo}
				onChange={handleInvoiceNumber}
				className={classes.textField}
				margin="normal"
			/>
			<div className={classes.datePicker}>
				<DatePicker
					disableFuture
					value={invoice.date}
					onChange={handleDateChange}
					format="Do MMMM YYYY"
					animateYearScrolling
				/>
			</div>
			<Select
				label="Choose Client"
				value={invoice.client}
				onChange={handleClientChange}
				className={classes.select}
				// error={!(errorDetails.client.length === 1)}
				// 				helperText={errorDetails.client.length > 1 ? errorDetails.mileage : ''}
				displayEmpty
				inputProps={{
					name: 'client',
					id: 'client'
				}}
			>
				<MenuItem value="" disabled className={classes.textField}>
					Choose Client
				</MenuItem>
				{clients.map(c => (
					<MenuItem value={c} key={c._id} className={classes.textField}>
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
						errorInvoice.mileage.length > 1 ? errorInvoice.mileage : ''
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
				helperText={errorInvoice.message.length > 1 ? errorInvoice.message : ''}
			/>
		</Fragment>
	);
};

export default InvoiceDetails;
