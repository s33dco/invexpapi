import React, { useState, useEffect } from 'react';
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
import { registerUser, clearErrors } from '../../actions/authActions';
import { checkName, simpleEmail, checkPassword } from '../../../config/regexps';

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

const RegisterModal = props => {
	const { registerUser, clearErrors, error, user, isAuthenticated } = props;

	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setpassword] = useState('');
	const [password2, setpassword2] = useState('');
	const [disabled, setDisabled] = useState(true);
	const [dbError, setDbError] = useState('');
	const [formErrors, setFormErrors] = useState({
		name: '',
		email: '',
		password: '',
		password2: ''
	});

	const onNameChange = e => {
		setName(e.target.value);
		if (e.target.value.match(checkName)) {
			setFormErrors({ ...formErrors, name: 'ok' });
		} else {
			setFormErrors({ ...formErrors, name: "Your name doesn't look right!" });
		}
	};

	const onEmailChange = e => {
		setEmail(e.target.value);
		if (e.target.value.match(simpleEmail)) {
			setFormErrors({ ...formErrors, email: 'ok' });
		} else {
			setFormErrors({ ...formErrors, email: 'Please check email address!' });
		}
	};

	const onPasswordChange = e => {
		setpassword(e.target.value);
		if (e.target.value.match(checkPassword)) {
			setFormErrors({ ...formErrors, password: 'ok' });
		} else {
			setFormErrors({
				...formErrors,
				password:
					'Password requires capital and lowercase letter, a number and a symbol, minimum 8 characters.'
			});
		}
	};

	const onPassword2Change = e => {
		setpassword2(e.target.value);
		if (e.target.value === password) {
			setFormErrors({ ...formErrors, password2: 'ok' });
		} else {
			setFormErrors({ ...formErrors, password2: 'Passwords need to match.' });
		}
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setName('');
		setEmail('');
		setpassword('');
		setpassword2('');
		setDbError('');
		setFormErrors({
			email: '',
			password: ''
		});
		setOpen(false);
	};

	const canSend = () => {
		if (
			(formErrors.name &&
				formErrors.email &&
				formErrors.password &&
				formErrors.password2) === 'ok'
		) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	};

	const onSubmit = e => {
		e.preventDefault();
		const newUser = {
			name,
			email,
			password
		};
		registerUser(newUser);
	};

	useEffect(() => {
		// if authenticated redirect to root
		if (isAuthenticated && user) {
			props.history.push('/');
		}

		if (error) {
			setDbError(error);
			clearErrors();
			setEmail('');
			setTimeout(() => setDbError(''), 3000);
			setDisabled(true);
		}

		// eslint-disable-next-line
	}, [error, isAuthenticated, props.history]); // dependencies for useEffect

	return (
		<div>
			<Button
				type="button"
				variant="contained"
				color="primary"
				onClick={handleOpen}
			>
				Sign Up
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
								Sign Up
							</Typography>

							<TextField
								required
								error={!!(formErrors.name && formErrors.name !== 'ok')}
								placeholder="Name"
								label="Name"
								id="name"
								type="text"
								value={name}
								className={classes.textField}
								margin="normal"
								onChange={onNameChange}
								onBlur={canSend}
								helperText={
									formErrors.name && formErrors.name !== 'ok'
										? formErrors.name
										: ''
								}
							/>
							<TextField
								required
								error={!!(formErrors.email && formErrors.email !== 'ok')}
								placeholder="Email"
								label="Email"
								id="email"
								type="email"
								value={email}
								onChange={onEmailChange}
								onBlur={canSend}
								className={classes.textField}
								margin="normal"
								helperText={
									formErrors.email && formErrors.email !== 'ok'
										? formErrors.email
										: ''
								}
							/>
							<TextField
								required
								error={!!(formErrors.password && formErrors.password !== 'ok')}
								placeholder="Password"
								label="Password"
								id="password"
								type="password"
								value={password}
								onChange={onPasswordChange}
								onBlur={canSend}
								className={classes.textField}
								margin="normal"
								helperText={
									formErrors.password && formErrors.password !== 'ok'
										? formErrors.password
										: ''
								}
							/>
							<TextField
								required
								error={
									!!(formErrors.password2 && formErrors.password2 !== 'ok')
								}
								placeholder="Confirm Password"
								label="Confirm Password"
								id="password2"
								type="password"
								value={password2}
								onChange={onPassword2Change}
								onBlur={canSend}
								className={classes.textField}
								margin="normal"
								helperText={
									formErrors.password2 && formErrors.password2 !== 'ok'
										? formErrors.password2
										: ''
								}
							/>
							<div>
								<Button
									type="button"
									variant="contained"
									color="primary"
									onClick={onSubmit}
									disabled={disabled}
								>
									Register
								</Button>
							</div>
						</Container>
					</div>
				</Fade>
			</Modal>
		</div>
	);
};

RegisterModal.propTypes = {
	registerUser: PropTypes.func.isRequired,
	clearErrors: PropTypes.func.isRequired,
	error: PropTypes.string,
	isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
	error: state.auth.error,
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user
});

export default connect(
	mapStateToProps,
	{ registerUser, clearErrors }
)(RegisterModal);
