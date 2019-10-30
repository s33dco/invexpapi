import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';

const useStyles = makeStyles(theme => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		marginTop: theme.spacing(2),
	},
	root: {
		flexGrow: '1',
		width: '100%',
		margin: 'theme.spacing(4),auto',
		maxWidth: '600px',
		marginBottom: '2.5vh',
	},
	buttons: {
		display: 'flex',
		flexDirection: 'right',
		justifyContent: 'space-evenly',
		width: '100%',
		margin: '10vh 0',
	},
}));

const About = () => {
	const classes = useStyles();

	return (
		<Container className={classes.container}>
			<Container className={classes.root}>
				<Grid>
					<Typography variant="h4" component="h1" align="center">
						Running your business just got a whole lot easier...
					</Typography>
				</Grid>
			</Container>
			<Container className={classes.root}>
				<Grid>
					<Typography align="center">
						You can manage you're business from your phone, track
						expenses, produce invoices and easily handle your self
						assesment HMRC tax return.
					</Typography>
				</Grid>
			</Container>
			<Container className={classes.root}>
				<Grid>
					<Typography align="center">
						We know you don't have time for this admin so we're here
						to help. You don't even have to capitalize the sentances
						you type - we'll do it for you!
					</Typography>
				</Grid>
			</Container>
			<Container className={classes.root}>
				<Grid>
					<Typography align="center">
						Sign up and start making life easier...
					</Typography>
				</Grid>
			</Container>
			<Container className={classes.buttons}>
				<Grid container direction="row" justify="space-evenly">
					<RegisterModal />
					<LoginModal />
				</Grid>
			</Container>
		</Container>
	);
};

export default About;
