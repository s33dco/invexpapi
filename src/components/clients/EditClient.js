import React, { useState, useEffect, Fragment } from 'react';
// import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { titleCase } from '../../../config/textFormat';
import {
	updateClient,
	clearClientErrors,
	clearCurrentClient,
} from '../../actions/clientsActions';
import {
	businessName,
	checkName,
	checkPhoneNumber,
	checkPostcode,
	simpleEmail,
} from '../../../config/regexps';

const useStyles = makeStyles(theme => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		width: '90vw',
		maxHeight: '90vh',
		overflowY: 'auto',
	},
	'@media (min-width: 600px)': {
		paper: {
			width: '50vw',
		},
	},
	textField: {
		marginLeft: '0',
		marginRight: '0',
		width: '100%',
	},
	form: {
		margin: '0',
		width: '100%',
	},
	divider: {
		margin: '1vh 0',
	},
}));

const EditClient = ({
	updateClient,
	clearClientErrors,
	clearCurrentClient,
	error,
	current,
}) => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [dbError, setDbError] = useState('');
	const [hasSent, setHasSent] = useState(false);
	const [inProcess, setInProcess] = useState(false);
	const [record, setRecord] = useState({ id: '' });
	const [client, setClient] = useState({
		name: '',
		email: '',
		phone: '',
		add1: '',
		add2: '',
		add3: '',
		postCode: '',
		greeting: '',
	});
	const [formErrors, setFormErrors] = useState({
		name: '1',
		phone: '1',
		email: '1',
		add1: '1',
		add2: '1',
		add3: '1',
		postCode: '1',
		greeting: '1',
	});

	useEffect(() => {
		if (current && !inProcess) {
			setOpen(true);
			const { _id, ...toUpdate } = current;
			const objId = _id.toString();
			setRecord({ ...record, id: objId });
			setClient({ ...client, ...toUpdate });
			setInProcess(true);
		}

		if (error) {
			setHasSent(false);
			setDbError('Please take another look...'); // set form level error
			setFormErrors({ ...formErrors, email: error }); // set field level error
			setClient({ ...client, email: '' }); // clear email field on form
			setDisabled(true); // disable sebd button on form
		}

		if (current && hasSent && !error && !dbError && !disabled) {
			handleClose();
		}
		// eslint - disable - next - line;
	}, [error, current, hasSent, inProcess, dbError]);

	const resetForm = () => {
		setDisabled(true);
		setHasSent(false);
		setRecord({ ...record, id: '' });
		setClient({
			name: '',
			email: '',
			phone: '',
			add1: '',
			add2: '',
			add3: '',
			postCode: '',
			greeting: '',
		});
		setFormErrors({
			name: '1',
			phone: '1',
			email: '1',
			add1: '1',
			add2: '1',
			add3: '1',
			postCode: '1',
			greeting: '1',
		});
	};
	const resetFormErrors = async () => {
		await clearClientErrors();
		setDbError('');
	};
	const handleClose = () => {
		setOpen(false);
		resetFormErrors();
		resetForm();
		clearCurrentClient();
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
		await updateClient(record.id, { ...client });
		setHasSent(true);
	};

	const handleChange = e => {
		let regExp;
		let message;
		switch (e.target.id) {
			case 'email':
				regExp = simpleEmail;
				message = "the email address doesn't look right";
				break;
			case 'postCode':
				regExp = checkPostcode;
				message = "the postcode doesn't look right";
				break;
			case 'phone':
				regExp = checkPhoneNumber;
				message =
					'check the phone number - just the right anount of digits needed';
				break;
			case 'name':
			case 'greeting':
				regExp = businessName;
				message = 'Just word characters please';
				break;
			default:
				regExp = checkName;
				message = 'no weird characters please';
		}
		setClient({
			...client,
			[e.target.id]: e.target.value,
		});
		if (e.target.id === 'add2' || 'add3') {
			if (e.target.value === '' || e.target.value.match(regExp)) {
				setFormErrors({
					...formErrors,
					[e.target.id]: '1',
				});
			} else {
				setFormErrors({
					...formErrors,
					[e.target.id]: message,
				});
			}
		} else if (e.target.value.match(regExp)) {
			setFormErrors({
				...formErrors,
				[e.target.id]: '1',
			});
		} else {
			setFormErrors({
				...formErrors,
				[e.target.id]: message,
			});
		}
	};

	return (
		<>
			<Modal
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
				className={classes.modal}
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<div className={classes.paper}>
						<Container component="form" className={classes.form}>
							{current && (
								<Typography
									variant="h5"
									component="h1"
									align="center"
								>
									Editing {titleCase(current.name)}
								</Typography>
							)}
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
								placeholder="Client Name"
								label="Client Name"
								id="name"
								type="text"
								value={client.name}
								onChange={handleChange}
								onBlur={canSend}
								className={classes.textField}
								margin="normal"
								helperText={
									formErrors.name.length > 1 ? formErrors.name : ''
								}
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
								value={client.email}
								onChange={handleChange}
								onBlur={canSend}
								className={classes.textField}
								margin="normal"
								helperText={
									formErrors.email.length > 1 ? formErrors.email : ''
								}
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
								value={client.phone}
								onChange={handleChange}
								onBlur={canSend}
								className={classes.textField}
								margin="normal"
								helperText={
									formErrors.phone.length > 1 ? formErrors.phone : ''
								}
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
								value={client.add1}
								onChange={handleChange}
								onBlur={canSend}
								className={classes.textField}
								margin="normal"
								helperText={
									formErrors.add1.length > 1 ? formErrors.add1 : ''
								}
							/>

							<TextField
								controlled="true"
								error={!(formErrors.add2.length === 1)}
								placeholder="Address"
								label="Address"
								name="add2"
								id="add2"
								type="text"
								value={client.add2}
								onChange={handleChange}
								onBlur={canSend}
								className={classes.textField}
								margin="normal"
								helperText={
									formErrors.add2.length > 1 ? formErrors.add2 : ''
								}
							/>

							<TextField
								controlled="true"
								error={!(formErrors.add3.length === 1)}
								placeholder="Address"
								label="Address"
								name="add3"
								id="add3"
								type="text"
								value={client.add3}
								onChange={handleChange}
								onBlur={canSend}
								className={classes.textField}
								margin="normal"
								helperText={
									formErrors.add3.length > 1 ? formErrors.add3 : ''
								}
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
								value={client.postCode}
								onChange={handleChange}
								onBlur={canSend}
								className={classes.textField}
								margin="normal"
								helperText={
									formErrors.postCode.length > 1
										? formErrors.postCode
										: ''
								}
							/>

							<TextField
								controlled="true"
								required
								error={!(formErrors.greeting.length === 1)}
								placeholder="Email Greeting"
								label="Email Greeting"
								name="greeting"
								id="greeting"
								type="text"
								value={client.greeting}
								onChange={handleChange}
								onBlur={canSend}
								className={classes.textField}
								margin="normal"
								helperText={
									formErrors.greeting.length > 1
										? formErrors.greeting
										: ''
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
					</div>
				</Fade>
			</Modal>
		</>
	);
};

EditClient.propTypes = {
	updateClient: PropTypes.func.isRequired,
	clearClientErrors: PropTypes.func.isRequired,
	clearCurrentClient: PropTypes.func.isRequired,
	error: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
	current: state.clients.current,
	error: state.clients.error,
});

export default connect(
	mapStateToProps,
	{ updateClient, clearClientErrors, clearCurrentClient }
)(EditClient);
