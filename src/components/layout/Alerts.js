import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';

const useStyles = makeStyles(() => ({
	root: {
		padding: '1vh 1vw',
		marginBottom: '2.5vh'
		// background: '#4caf50'
	}
}));

const Alerts = ({ alerts }) => {
	const classes = useStyles();

	return (
		alerts.length > 0 &&
		alerts.map(alert => (
			<Paper className={classes.root} key={alert.id}>
				<Typography align="center" component="p">
					{alert.msg}
				</Typography>
			</Paper>
		))
	);
};

const mapStateToProps = state => ({
	alerts: state.alert
});

export default connect(mapStateToProps)(Alerts);
