import React from 'react';
import Grid from '@material-ui/core/Grid';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';

const About = () => {
	return (
		<Grid container direction="row" justify="space-evenly">
			<RegisterModal />
			<LoginModal />
		</Grid>
	);
};

export default About;
