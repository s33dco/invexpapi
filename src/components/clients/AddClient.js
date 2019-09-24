import React, { useState, useEffect } from 'react';
// import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addClient, clearClientErrors } from '../../actions/clientsActions';
import {
	businessName,
	checkName,
	checkPhoneNumber,
	checkPostcode,
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
		width: '90vw',
		maxHeight: '90vh',
		overflowY: 'auto'
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

const AddClient = props => {
	const { addClient, clearClientErrors, error, clients } = props;
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [client, setClient] = useState({
		name: '',
		email: '',
		phone: '',
		add1: '',
		add2: '',
		add3: '',
		postCode: '',
		greeting: ''
	});
	const [formErrors, setFormErrors] = useState({
		name: '0',
		phone: '0',
		email: '1',
		add1: '0',
		add2: '1',
		add3: '1',
		postCode: '0',
		greeting: '0'
	});
	const [disabled, setDisabled] = useState(true);
	const [dbError, setDbError] = useState('');

	useEffect(() => {
		if (error) {
			setDbError(error);
			// clearClientErrors();
			setFormErrors({
				...formErrors,
				email: 'this email address is invalid!'
			});
			setTimeout(() => setDbError(''), 7000);
			setDisabled(true);
		}
		if (formErrors.email === '1' && disabled === false && !error) {
			clearForm();
			// clearClientErrors();
			handleClose();
		}
		// eslint - disable - next - line;
	}, [error, clients]); // dependencies for useEffect

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
			greeting: ''
		});
		setFormErrors({
			name: '0',
			phone: '0',
			email: '0',
			add1: '0',
			add2: '1',
			add3: '1',
			postCode: '0',
			greeting: '0'
		});
	};

	const canSend = () => {
		if (Array.from(new Set(Object.values(formErrors))).length === 1) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	};

	const onSubmit = e => {
		e.preventDefault();
		const create = { ...client };
		console.log(create);
		addClient(create);
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
				message = 'check the number - just digits';
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

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button
				type="button"
				variant="contained"
				color="primary"
				onClick={handleOpen}
			>
				Add
			</Button>
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
									{dbError}
								</Typography>
							)}
							<Typography variant="h5" component="h1" align="center">
								Add A New Client
							</Typography>
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
								helperText={formErrors.name.length > 1 ? formErrors.name : ''}
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
								value={client.phone}
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
								value={client.add1}
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
								value={client.add2}
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
								value={client.add3}
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
								value={client.postCode}
								onChange={handleChange}
								onBlur={canSend}
								className={classes.textField}
								margin="normal"
								helperText={
									formErrors.postCode.length > 1 ? formErrors.postCode : ''
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
									formErrors.greeting.length > 1 ? formErrors.greeting : ''
								}
							/>

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
	clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	clients: state.clients.clients,
	error: state.clients.error
});

export default connect(
	mapStateToProps,
	{ addClient, clearClientErrors }
)(AddClient);
