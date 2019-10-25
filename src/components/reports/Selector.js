import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker } from '@material-ui/pickers';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		width: '90vw',
		maxHeight: '90vh',
		overflowY: 'auto'
	},
	text: {
		margin: theme.spacing(1, 0, 3),
		padding: theme.spacing(2, 1)
	},
	dates: {
		margin: theme.spacing(3),
		padding: theme.spacing(2, 1),
		borderRadius: theme.spacing(2)
	},
	datePicker: {
		margin: theme.spacing(3, 3, 3, 3),
		padding: theme.spacing(2, 2, 2, 2),
		width: '15em'
	},
	'@media (min-width: 600px)': {
		paper: {
			width: '50vw'
		}
	},
	datePicker: {
		margin: theme.spacing(2, 0)
	},
	textField: {
		marginLeft: '0',
		marginRight: '0',
		minWidth: '15em',
		width: '100%'
	}
}));

const Selector = ({
	invoices,
	expenses,
	startDate,
	endDate,
	handleStartDate,
	handleEndDate,
	formError
}) => {
	const classes = useStyles();

	return (
		<Container>
			<h1>Reports</h1>
			<Typography variant="body1" component="h3" align="center">
				Select the date ranges for a financial summary.
			</Typography>
			<Typography
				className={classes.text}
				variant="body1"
				component="h3"
				align="center"
			>
				The figures are broken down via the HMRC categories and available to
				print of download. Your end of year tax return is just a few clicks
				away!
			</Typography>
			{invoices.length === 0 && expenses.length === 0 && (
				<Typography
					className={classes.text}
					variant="body1"
					component="h3"
					align="center"
				>
					You will be able to run reports after some data has been created.
				</Typography>
			)}
			<Container className={classes.dates}>
				<Container className={classes.datePicker}>
					<DatePicker
						disableFuture
						maxDate={moment(endDate).utc()}
						label="Start Date"
						value={startDate}
						disabled={invoices === 0 && expenses === 0}
						onChange={handleStartDate}
						error={!(formError.start.length === 1)}
						helperText={formError.start.length > 1 ? formError.start : ''}
						format="Do MMMM YYYY"
						animateYearScrolling
					/>
				</Container>
				<Container className={classes.datePicker}>
					<DatePicker
						label="End Date"
						minDate={moment(startDate).utc()}
						disabled={invoices === 0 && expenses === 0}
						value={endDate}
						onChange={handleEndDate}
						error={!(formError.end.length === 1)}
						helperText={formError.end.length > 1 ? formError.end : ''}
						format="Do MMMM YYYY"
						animateYearScrolling
					/>
				</Container>
			</Container>
		</Container>
	);
};

Selector.propTypes = {};

export default Selector;
