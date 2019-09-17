import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loginUser, clearErrors } from '../../actions/authActions';
import { setAlert } from '../../actions/alertActions';
import { simpleEmail, checkPassword } from '../../../config/regexps';

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

const LoginModal = props => {
	const {
		loginUser,
		setAlert,
		clearErrors,
		error,
		user,
		isAuthenticated
	} = props;

	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setpassword] = useState('');
	const [disabled, setDisabled] = useState(true);
	const [formErrors, setFormErrors] = useState({
		email: '',
		password: ''
	});

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

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const canSend = () => {
		if ((formErrors.email && formErrors.password) === 'ok') {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	};

	const onSubmit = e => {
		e.preventDefault();
		const newUser = {
			email,
			password
		};
		loginUser(newUser);
	};

	useEffect(() => {
		// if authenticated redirect to root
		if (isAuthenticated && user) {
			handleClose();
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
				Sign In
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
						<h2 id="transition-modal-title">Sign In</h2>
						<p id="transition-modal-description">Sign In and get the cash</p>

						<form className="container">
							<div className="row">
								<div className="input-field">
									<input
										placeholder="Email Address"
										id="logEmail"
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
										id="logPassword"
										type="password"
										value={password}
										onChange={onPasswordChange}
										onBlur={canSend}
									/>
								</div>
								{formErrors.password && <p>{formErrors.password}</p>}
							</div>
							<div className="row">
								<Button
									type="button"
									variant="contained"
									color="primary"
									onClick={onSubmit}
									disabled={disabled}
								>
									Sign In
								</Button>
							</div>
						</form>
					</div>
				</Fade>
			</Modal>
		</div>
	);
};

LoginModal.propTypes = {
	loginUser: PropTypes.func.isRequired,
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
	{ loginUser, clearErrors, setAlert }
)(LoginModal);
