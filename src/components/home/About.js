import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		marginBottom: '2.5vh'
	}
}));

const About = () => {
	const classes = useStyles();

	return (
		<Fragment>
			<Container className={classes.root}>
				<Grid>
					<Typography variant="h3" component="h1" align="center">
						Running your business just got easier...
					</Typography>
				</Grid>
			</Container>
			<Container className={classes.root}>
				<Grid>
					<Typography>
						You can manage you're business from your phone, track expenses,
						produce invoices and easily handle your self assesment HMRC tax
						return.
					</Typography>
				</Grid>
			</Container>
			<Container className={classes.root}>
				<Grid>
					<Typography>
						We know you don't have time for this admin so we're here to help.
						You don't even have to capitalize the sentances you type - we'll do
						it for you!
					</Typography>
				</Grid>
			</Container>
			<Container className={classes.root}>
				<Grid>
					<Typography>Sign up and start making life easier...</Typography>
				</Grid>
			</Container>
			<Container className={classes.root}>
				<Grid container direction="row" justify="space-evenly">
					<RegisterModal />
					<LoginModal />
				</Grid>
			</Container>
		</Fragment>
	);
};

export default About;
