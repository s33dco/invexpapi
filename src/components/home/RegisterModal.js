import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { registerUser, clearErrors } from '../../actions/authActions';
import { setAlert } from '../../actions/alertActions';
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
		padding: theme.spacing(2, 4, 3)
	}
}));

const RegisterModal = props => {
	const {
		registerUser,
		setAlert,
		clearErrors,
		error,
		user,
		isAuthenticated
	} = props;

	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setpassword] = useState('');
	const [password2, setpassword2] = useState('');
	const [disabled, setDisabled] = useState(true);
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
			setAlert(error, 'danger');
			clearErrors();
			setEmail('');
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
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
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
						<h2 id="transition-modal-title">Sign Up</h2>
						<p id="transition-modal-description">Register to use</p>
						<form className="container">
							<div className="row">
								<div className="input-field">
									<input
										placeholder="Name"
										id="name"
										type="text"
										value={name}
										onChange={onNameChange}
										onBlur={canSend}
									/>
									{formErrors.name && <p>{formErrors.name}</p>}
								</div>
							</div>
							<div className="row">
								<div className="input-field">
									<input
										placeholder="Email Address"
										id="email"
										type="email"
										value={email}
										onChange={onEmailChange}
										onBlur={canSend}
									/>
									{formErrors.email && <p>{formErrors.email}</p>}
								</div>
							</div>
							<div className="row">
								<div className="input-field">
									<input
										placeholder="password"
										id="password"
										type="password"
										value={password}
										onChange={onPasswordChange}
										onBlur={canSend}
									/>
								</div>
								{formErrors.password && <p>{formErrors.password}</p>}
							</div>
							<div className="row">
								<div className="input-field">
									<input
										placeholder="Confirm password"
										id="password2"
										type="password"
										value={password2}
										onChange={onPassword2Change}
										onBlur={canSend}
									/>
								</div>
								{formErrors.password2 && <p>{formErrors.password2}</p>}
							</div>

							<div className="row">
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
						</form>
					</div>
				</Fade>
			</Modal>
		</div>
	);
};

RegisterModal.propTypes = {
	registerUser: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
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
	{ registerUser, clearErrors, setAlert }
)(RegisterModal);