import React, { Fragment, useState } from 'react';

const Register = () => {
	const [
		name,
		nameError,
		email,
		emailError,
		password,
		passwordError
	] = useState('');
	const disabled = useState(true);
	const buttonText = useState('register');

	return (
		<Fragment>
			<p>Register</p>
		</Fragment>
	);
};

export default Register;
