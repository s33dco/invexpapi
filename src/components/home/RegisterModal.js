import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { registerUser, clearErrors } from '../../actions/authActions';
import { setAlert } from '../../actions/alertActions';
import { checkName, simpleEmail, checkPassword } from '../../../config/regexps';

const RegisterModal = props => {
	const {
		registerUser,
		setAlert,
		clearErrors,
		error,
		user,
		isAuthenticated
	} = props;
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
		<form className="container">
			<h4>Sign Up</h4>
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
			<button href="#!" type="submit" onClick={onSubmit} disabled={disabled}>
				Sign Up
			</button>
		</form>
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
