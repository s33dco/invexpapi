/* eslint-disable react/require-default-props */
import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import numeral from 'numeral';

numeral.locale('en-gb');
numeral.defaultFormat('$0,0.00');

const useStyles = makeStyles(theme => ({
	summary: {
		margin: '0',
		padding: '0',
		borderRadius: theme.spacing(1),
		boxShadow: theme.shadows[1],
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
}));

const DashSummary = ({ dashBoard }) => {
	const classes = useStyles();

	return (
		<Container className={classes.summary}>
			<Container>
				<Typography variant="h6" component="h2" align="center">
					Current Tax Year Summary
				</Typography>
			</Container>
			<Container>
				<Typography variant="h6" component="h2" align="center">
					Income : {dashBoard.income}
				</Typography>
				<Typography align="center">
					{dashBoard.numberOfInvoices} invoices /{' '}
					{dashBoard.numberOfClients} clients.
				</Typography>

				<Typography variant="body2" component="h3" align="center">
					Receipts {dashBoard.receipts}
				</Typography>
				<Typography variant="body2" component="h3" align="center">
					Deductions {dashBoard.deductions}
				</Typography>
			</Container>
		</Container>
	);
};
DashSummary.propTypes = {
	dashBoard: PropTypes.shape({
		numberOfClients: PropTypes.number,
		numberOfInvoices: PropTypes.number,
		deductions: PropTypes.string.isRequired,
		income: PropTypes.string.isRequired,
		receipts: PropTypes.string.isRequired,
	}),
};

export default DashSummary;
