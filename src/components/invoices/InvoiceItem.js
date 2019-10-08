import React from 'react';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';
import { DatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	wrapper: {
		margin: theme.spacing(1, 0, 3),
		padding: theme.spacing(2, 1),
		borderRadius: theme.spacing(2),
		boxShadow: theme.shadows[2]
	},
	datePicker: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		// margin: theme.spacing(2, 0),
		width: '100%'
	},
	textField: {
		marginLeft: '0',
		marginRight: '0',
		width: '100%'
	}
}));

const InvoiceItem = props => {
	const classes = useStyles();
	const {
		item,
		updateChangedDateField,
		updateChangedTextField,
		deleteItem,
		errorInvoice,
		canSend,
		invDate
	} = props;

	return (
		<Container className={classes.wrapper}>
			<div className={classes.datePicker}>
				<DatePicker
					disableFuture
					maxDate={moment(invDate).utc()}
					maxDateMessage="Date should be on or before invoice date"
					label="Item Date"
					// error={!(errorInvoice.date.length === 1)}
					id="date"
					value={item.date}
					onChange={updateChangedDateField(item.id)}
					format="Do MMMM YYYY"
					animateYearScrolling
				/>
				<IconButton
					aria-label="delete invoice item"
					onClick={() => deleteItem(item.id)}
				>
					<DeleteIcon />
				</IconButton>
			</div>
			<TextField
				controlled="true"
				required
				error={errorInvoice[item.id] && errorInvoice[item.id].desc.length > 1}
				placeholder="Description"
				label="Description"
				id="desc"
				name="desc"
				type="text"
				multiline
				rows={1}
				rowsMax={10}
				value={item.desc}
				onChange={updateChangedTextField(item.id)}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={
					errorInvoice[item.id] && errorInvoice[item.id].desc.length > 1
						? errorInvoice[item.id].desc
						: ''
				}
			/>
			<TextField
				controlled="true"
				required
				error={errorInvoice[item.id] && errorInvoice[item.id].fee.length > 1}
				placeholder="Amount"
				label="Fee"
				id="fee"
				name="fee"
				type="text"
				value={item.fee}
				onChange={updateChangedTextField(item.id)}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={
					errorInvoice[item.id] && errorInvoice[item.id].fee.length > 1
						? errorInvoice[item.id].fee
						: ''
				}
			/>
		</Container>
	);
};

export default InvoiceItem;
