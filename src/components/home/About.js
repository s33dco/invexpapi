import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	paper: {
		height: 140,
		width: 100
	},
	control: {
		padding: theme.spacing(2)
	}
}));

const About = () => {
	return (
		<Grid container direction="row" justify="center" alignItems="center">
			<RegisterModal />
			<LoginModal />
		</Grid>
	);
};

export default About;
