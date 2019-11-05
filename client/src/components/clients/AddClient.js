/* eslint-disable react/require-default-props */
/* eslint-disable no-constant-condition */
/* eslint-disable no-shadow */
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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	addClient,
	clearClientErrors,
} from '../../actions/clientsActions';
import {
	businessName,
	checkName,
	checkPhoneNumber,
	checkPostcode,
	simpleEmail,
} from '../../../../config/regexps';

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
	fab: {
		margin: theme.spacing(1),
		padding: theme.spacing(0.5),
	},
	extendedIcon: {
		marginRight: theme.spacing(0.25),
	},
}));

const AddClient = ({
	addClient,
	clearClientErrors,
	error,
	clients,
}) => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [dbError, setDbError] = useState('');
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
		name: '0',
		phone: '0',
		email: '0',
		add1: '0',
		add2: '1',
		add3: '1',
		postCode: '0',
		greeting: '0',
	});

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const clearForm = () => {
		setDisabled(true);
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
			name: '0',
			phone: '0',
			email: '0',
			add1: '0',
			add2: '1',
			add3: '1',
			postCode: '0',
			greeting: '0',
		});
	};

	useEffect(() => {
		if (error) {
			// if api error
			setDbError('Please take another look...'); // set form level error
			setFormErrors({ ...formErrors, email: error }); // set field level error
			clearClientErrors(); // clear api level error
		}
		if (!error && !dbError && !disabled) {
			// no api or form errors and form enabled
			clearForm();
			handleClose();
		}
		// eslint - disable - next - line;
	}, [error, clients]); // check for changes from api, api error and change in record being updated

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
		addClient({ ...client });
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
		<div>
			<Fab
				aria-label="add"
				className={classes.fab}
				color="primary"
				onClick={handleOpen}
				size="small"
				variant="extended"
			>
				<AddIcon className={classes.extendedIcon} />
				Client
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
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<div className={classes.paper}>
						<Container component="form" className={classes.form}>
							<Typography variant="h5" component="h1" align="center">
								Add A Client
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
									Add Client
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
		</div>
	);
};

AddClient.propTypes = {
	addClient: PropTypes.func.isRequired,
	clearClientErrors: PropTypes.func.isRequired,
	error: PropTypes.string.isRequired,
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
	),
};

const mapStateToProps = state => ({
	clients: state.clients.clients,
	error: state.clients.error,
});

export default connect(
	mapStateToProps,
	{ addClient, clearClientErrors }
)(AddClient);
