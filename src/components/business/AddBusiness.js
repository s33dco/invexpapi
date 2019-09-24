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
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	addBusiness,
	clearBusinessErrors
} from '../../actions/businessActions';
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
	},
	divider: {
		margin: '1vh 0'
	}
}));

const AddBusiness = ({
	addBusiness,
	clearBusinessErrors,
	error,
	businessAppState
}) => {
	const classes = useStyles();
	const [disabled, setDisabled] = useState(true);
	const [dbError, setDbError] = useState('');
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
		name: '0',
		contact: '0',
		phone: '0',
		email: '0',
		add1: '0',
		add2: '1',
		add3: '1',
		postCode: '0',
		bankName: '0',
		accountNo: '0',
		sortCode: '0',
		utr: '0',
		terms: '0',
		farewell: '0'
	});

	useEffect(() => {
		if (error) {
			// if api error
			setDbError('Please take another look...'); // set form level error
			setFormErrors({ ...formErrors, email: error }); // set field level error
			clearBusinessErrors(); // clear api level error
		}
		if (!error && !dbError && !disabled) {
			// no api or form errors and form enabled
			handleClose();
		}
		// eslint - disable - next - line;
	}, [error, businessAppState]); // check for changes from api, api error and change in record being updated

	const canSend = () => {
		if (Array.from(new Set(Object.values(formErrors))).length === 1) {
			setDisabled(false);
			setDbError('');
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
				message = 'check the number - just digits';
				break;
			case 'terms':
			case 'name':
			case 'farewell':
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
				[e.target.id]: '1'
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
			<Typography variant="h5" component="h1" align="center">
				Add Your Business Details, these will appear on the Invoices and Emails
				you produce.
			</Typography>
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
			<TextField
				controlled="true"
				required
				error={!(formErrors.name.length === 1)}
				placeholder="Business Name"
				label="Business Name"
				id="name"
				type="text"
				value={business.name}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.name.length > 1 ? formErrors.name : ''}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.contact.length === 1)}
				placeholder="Contact Name"
				label="Contact Name"
				name="contact"
				id="contact"
				type="text"
				value={business.contact}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.contact.length > 1 ? formErrors.contact : ''}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.email.length === 1)}
				placeholder="Email Address"
				label="Email Address"
				name="email"
				id="email"
				type="text"
				value={business.email}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.email.length > 1 ? formErrors.email : ''}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.phone.length === 1)}
				placeholder="Phone Number"
				label="Phone Number"
				name="phone"
				id="phone"
				type="text"
				value={business.phone}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.phone.length > 1 ? formErrors.phone : ''}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.add1.length === 1)}
				placeholder="First Line of address"
				label="First Line of address"
				name="add1"
				id="add1"
				type="text"
				value={business.add1}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.add1.length > 1 ? formErrors.add1 : ''}
			/>

			<TextField
				controlled="true"
				error={!(formErrors.add2.length === 1)}
				placeholder="Address"
				label="Address"
				name="add2"
				id="add2"
				type="text"
				value={business.add2}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.add2.length > 1 ? formErrors.add2 : ''}
			/>

			<TextField
				controlled="true"
				error={!(formErrors.add3.length === 1)}
				placeholder="Address"
				label="Address"
				name="add3"
				id="add3"
				type="text"
				value={business.add3}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.add3.length > 1 ? formErrors.add3 : ''}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.postCode.length === 1)}
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
				helperText={formErrors.postCode.length > 1 ? formErrors.postCode : ''}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.bankName.length === 1)}
				placeholder="Your Bank's name"
				label="Your Bank's name"
				name="bankName"
				id="bankName"
				type="text"
				value={business.bankName}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.bankName.length > 1 ? formErrors.bankName : ''}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.accountNo.length === 1)}
				placeholder="Bank Account Number"
				label="Bank Account Number"
				name="accountNo"
				id="accountNo"
				type="text"
				value={business.accountNo}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.accountNo.length > 1 ? formErrors.accountNo : ''}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.sortCode.length === 1)}
				placeholder="Your Account's sortcode"
				label="Your Account's sortcode"
				name="sortCode"
				id="sortCode"
				type="text"
				value={business.sortCode}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.sortCode.length > 1 ? formErrors.sortCode : ''}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.utr.length === 1)}
				placeholder="Unique Tax Reference"
				label="Unique Tax Reference"
				name="utr"
				id="utr"
				type="text"
				value={business.utr}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.utr.length > 1 ? formErrors.utr : ''}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.terms.length === 1)}
				placeholder="Invoice Terms"
				label="Invoice Terms"
				name="terms"
				id="terms"
				type="text"
				multiline
				rows={1}
				rowsMax={8}
				value={business.terms}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.terms.length > 1 ? formErrors.terms : ''}
			/>

			<TextField
				controlled="true"
				required
				error={!(formErrors.farewell.length === 1)}
				placeholder="Invoice farewell"
				label="Invoice farewell"
				name="farewell"
				id="farewell"
				type="text"
				value={business.farewell}
				onChange={handleChange}
				onBlur={canSend}
				className={classes.textField}
				margin="normal"
				helperText={formErrors.farewell.length > 1 ? formErrors.farewell : ''}
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
				<FormHelperText>
					Choosing yes enables miles travelled on a per invoice basis to be
					tracked, making it easy to work out deductions under the HMRC
					simplified mileage scheme.{' '}
				</FormHelperText>
			</FormControl>

			<div>
				<div>
					<Divider className={classes.divider} />
				</div>
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
		</Container>
	);
};

AddBusiness.propTypes = {
	addBusiness: PropTypes.func.isRequired,
	clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	error: state.business.error,
	businessAppState: state.business.business
});

export default connect(
	mapStateToProps,
	{ addBusiness, clearBusinessErrors }
)(AddBusiness);
