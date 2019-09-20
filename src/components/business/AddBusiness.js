import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addBusiness, clearErrors } from '../../actions/businessActions';
import {
	businessName,
	checkName,
	checkPhoneNumber,
	checkPostcode,
	checkSortcode,
	checkAccountno,
	checkUTR,
	simpleEmail
} from '../../../config/regexps';

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
		width: '80vw'
	},
	textField: {
		marginLeft: '0',
		marginRight: '0',
		width: '100%'
	},
	form: {
		margin: '0',
		width: '100%'
	}
}));

const AddBusiness = props => {
	const { addBusiness, clearErrors, error } = props;
	const classes = useStyles();
	const [business, setBusiness] = useState({
		name: '',
		contact: '',
		phone: '',
		add1: '',
		add2: '',
		add3: '',
		postCode: '',
		bankName: '',
		accountNo: '',
		sortCode: '',
		utr: '',
		terms: '',
		farewell: '',
		useMileage: 'false'
	});
	const [formErrors, setFormErrors] = useState({
		name: 'ok',
		contact: 'ok',
		phone: 'ok',
		email: 'ok',
		add1: 'ok',
		add2: 'ok',
		add3: 'ok',
		postCode: 'ok',
		bankName: 'ok',
		accountNo: 'ok',
		sortCode: 'ok',
		utr: 'ok',
		terms: 'ok',
		farewell: 'ok'
	});
	const [disabled, setDisabled] = useState(true);
	const [dbError, setDbError] = useState('');

	const canSend = () => {
		console.log(formErrors);
		if (Object.values(formErrors).filter(v => v !== 'ok').length < 1) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	};

	const onSubmit = e => {
		e.preventDefault();
		addBusiness(business);
	};

	const handleChange = e => {
		let regExp;
		let message;
		switch (e.target.id) {
			case 'email':
				regExp = simpleEmail;
				message = "the email address doesn't look right";
				break;
			case 'utr':
				regExp = checkUTR;
				message = 'Tax reference should be 10 digits';
				break;
			case 'accountNo':
				regExp = checkAccountno;
				message = 'Account number should be 8 digits';
				break;
			case 'sortCode':
				regExp = checkSortcode;
				message = 'This sortcode looks wrong! (xx-xx-xx)';
				break;
			case 'postCode':
				regExp = checkPostcode;
				message = "the postcode doesn't look right";
				break;
			case 'phone':
				regExp = checkPhoneNumber;
				message = 'digits only for the phone number';
				break;
			case 'terms':
			case 'name':
				regExp = businessName;
				message = 'Just word characters please';
				break;
			default:
				regExp = checkName;
				message = 'no weird characters please';
		}
		setBusiness({
			...business,
			[e.target.id]: e.target.value
		});
		if (e.target.value.match(regExp)) {
			setFormErrors({
				...formErrors,
				[e.target.id]: 'ok'
			});
		} else {
			setFormErrors({
				...formErrors,
				[e.target.id]: message
			});
		}
	};

	const onRadioToggle = e => {
		setBusiness({ ...business, [e.target.name]: e.target.value });
	};

	return (
		<Container component="form" className={classes.form}>
			{dbError && (
				<Typography
					variant="subtitle2"
					component="h4"
					align="center"
					color="error"
				>
					{dbError}
				</Typography>
			)}
			<Typography variant="h5" component="h1" align="center">
				Add Your Business Details, these will appear on the Invoices and Emails
				you produce.
			</Typography>
			<TextField
				required
				error={!(formErrors.name === 'ok')}
				placeholder="Business Name"
				label="Business Name"
				id="name"
				type="name"
				value={business.name}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.name === 'ok' ? '' : formErrors.name}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.contact === 'ok')}
				placeholder="Contact Name"
				label="Contact Name"
				name="contact"
				id="contact"
				type="contact"
				value={business.contact}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.contact === 'ok' ? '' : formErrors.contact}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.email === 'ok')}
				placeholder="Email"
				label="Email"
				name="email"
				id="email"
				type="email"
				value={business.email}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.email === 'ok' ? '' : formErrors.email}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.phone === 'ok')}
				placeholder="Phone"
				label="Phone"
				name="phone"
				id="phone"
				type="phone"
				value={business.phone}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.phone === 'ok' ? '' : formErrors.phone}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.add1 === 'ok')}
				placeholder="First Line of address"
				label="First Line of address"
				name="add1"
				id="add1"
				type="add1"
				value={business.add1}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.add1 === 'ok' ? '' : formErrors.add1}
			/>

			<TextField
				controlled="true"
				error={!(formErrors.add2 === 'ok')}
				placeholder="Address"
				label="Address"
				name="add2"
				id="add2"
				type="add2"
				value={business.add2}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.add2 === 'ok' ? '' : formErrors.add2}
			/>

			<TextField
				controlled="true"
				error={!(formErrors.add3 === 'ok')}
				placeholder="Address"
				label="Address"
				name="add3"
				id="add3"
				type="add3"
				value={business.add3}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.add3 === 'ok' ? '' : formErrors.add3}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.postCode === 'ok')}
				placeholder="Postcode"
				label="Postcode"
				name="postCode"
				id="postCode"
				type="text"
				value={business.postCode}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.postCode === 'ok' ? '' : formErrors.postCode}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.bankName === 'ok')}
				placeholder="Your Bank's name"
				label="Your Bank's name"
				name="bankName"
				id="bankName"
				type="bankName"
				value={business.bankName}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.bankName === 'ok' ? '' : formErrors.bankName}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.accountNo === 'ok')}
				placeholder="Bank Account Number"
				label="Bank Account Number"
				name="accountNo"
				id="accountNo"
				type="accountNo"
				value={business.accountNo}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.accountNo === 'ok' ? '' : formErrors.accountNo}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.sortCode === 'ok')}
				placeholder="Bank Sortcode"
				label="Bank Sortcode"
				name="sortCode"
				id="sortCode"
				type="sortCode"
				value={business.sortCode}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.sortCode === 'ok' ? '' : formErrors.sortCode}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.utr === 'ok')}
				placeholder="Unique Tax Reference"
				label="Unique Tax Reference"
				name="utr"
				id="utr"
				type="utr"
				value={business.utr}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.utr === 'ok' ? '' : formErrors.utr}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.terms === 'ok')}
				placeholder="Invoice Terms"
				label="Invoice Terms"
				name="terms"
				id="terms"
				type="terms"
				value={business.terms}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.terms === 'ok' ? '' : formErrors.terms}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.farewell === 'ok')}
				placeholder="Invoice farewell"
				label="Invoice farewell"
				name="farewell"
				id="farewell"
				type="farewell"
				value={business.farewell}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.farewell === 'ok' ? '' : formErrors.farewell}
			/>

			<FormControl component="fieldset" className={classes.formControl}>
				<FormLabel component="legend">Use HMRC simplified mileage ?</FormLabel>
				<RadioGroup
					aria-label="useMileage"
					name="useMileage"
					value={business.useMileage}
					onChange={onRadioToggle}
				>
					<FormControlLabel
						value="true"
						control={<Radio color="primary" />}
						label="yes"
						labelPlacement="start"
					/>
					<FormControlLabel
						value="false"
						control={<Radio color="primary" />}
						label="no"
						labelPlacement="start"
					/>
				</RadioGroup>
			</FormControl>

			<div>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					onClick={onSubmit}
					disabled={disabled}
				>
					Create Business
				</Button>
			</div>
		</Container>
	);
};

AddBusiness.propTypes = {
	addBusiness: PropTypes.func.isRequired,
	clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	error: state.business.error
});

export default connect(
	mapStateToProps,
	{ addBusiness, clearErrors }
)(AddBusiness);
