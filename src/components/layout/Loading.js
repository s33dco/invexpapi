import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
	progress: {
		margin: theme.spacing(2)
	}
}));

const Loader = () => {
	const classes = useStyles();

	return (
		<Container>
			<CircularProgress className={classes.progress} size="40" />
		</Container>
	);
};

export default Loader;
