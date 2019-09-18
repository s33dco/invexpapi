import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';

// const useStyles = makeStyles(theme => ({
// 	root: {
// 		flexGrow: 1
// 	},
// 	paper: {
// 		height: 340,
// 		width: 200,
// 		textAlign: 'center',
// 		verticalAlign: 'center'
// 	},
// 	control: {
// 		padding: theme.spacing(3)
// 	}
// }));

const About = () => {
	// const classes = useStyles();

	return (
		<Grid container direction="row" justify="center" alignItems="center">
			<Grid Item>
				<Paper>
					<RegisterModal />
				</Paper>
			</Grid>
			<Grid Item>
				<Paper>
					<LoginModal />
				</Paper>
			</Grid>
		</Grid>
	);
};

export default About;
