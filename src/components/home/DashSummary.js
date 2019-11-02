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
					Income : {numeral(dashBoard.income).format()}
				</Typography>
				<Typography align="center">
					{dashBoard.numberOfInvoices} invoices /{' '}
					{dashBoard.numberOfClients} clients.
				</Typography>

				<Typography variant="body2" component="h3" align="center">
					Receipts {numeral(dashBoard.receipts).format()}
				</Typography>
				<Typography variant="body2" component="h3" align="center">
					Deductions {numeral(dashBoard.deductions).format()}
				</Typography>
			</Container>
		</Container>
	);
};
DashSummary.propTypes = {
	dashBoard: PropTypes.shape({
		numberOfClients: PropTypes.number,
		numberOfInvoices: PropTypes.number,
		deductions: PropTypes.shape({
			_input: PropTypes.number.isRequired,
			_value: PropTypes.number.isRequired,
			add: PropTypes.func.isRequired,
			clone: PropTypes.func.isRequired,
			difference: PropTypes.func.isRequired,
			divide: PropTypes.func.isRequired,
			format: PropTypes.func.isRequired,
			input: PropTypes.func.isRequired,
			multiply: PropTypes.func.isRequired,
			set: PropTypes.func.isRequired,
			subtract: PropTypes.func.isRequired,
			value: PropTypes.func.isRequired,
		}),
		income: PropTypes.shape({
			_input: PropTypes.number.isRequired,
			_value: PropTypes.number.isRequired,
			add: PropTypes.func.isRequired,
			clone: PropTypes.func.isRequired,
			difference: PropTypes.func.isRequired,
			divide: PropTypes.func.isRequired,
			format: PropTypes.func.isRequired,
			input: PropTypes.func.isRequired,
			multiply: PropTypes.func.isRequired,
			set: PropTypes.func.isRequired,
			subtract: PropTypes.func.isRequired,
			value: PropTypes.func.isRequired,
		}),
		receipts: PropTypes.shape({
			_input: PropTypes.number.isRequired,
			_value: PropTypes.number.isRequired,
			add: PropTypes.func.isRequired,
			clone: PropTypes.func.isRequired,
			difference: PropTypes.func.isRequired,
			divide: PropTypes.func.isRequired,
			format: PropTypes.func.isRequired,
			input: PropTypes.func.isRequired,
			multiply: PropTypes.func.isRequired,
			set: PropTypes.func.isRequired,
			subtract: PropTypes.func.isRequired,
			value: PropTypes.func.isRequired,
		}),
	}),
};

export default DashSummary;
