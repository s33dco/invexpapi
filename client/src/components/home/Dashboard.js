/* eslint-disable react/require-default-props */
/* eslint-disable no-shadow */
import React, { useEffect, useState, Fragment } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import numeral from 'numeral';
import setAlert from '../../actions/alertActions';
import InvoiceCard from '../invoices/InvoiceCard';
import EditInvoice from '../invoices/EditInvoice';
import AddInvoice from '../invoices/AddInvoice';
import AddExpense from '../expenses/AddExpense';
import AddClient from '../clients/AddClient';
import DeleteInvoiceDialog from '../invoices/DeleteInvoiceDialog';
import DashSummary from './DashSummary';

numeral.locale('en-gb');
numeral.defaultFormat('$0,0.00');

const useStyles = makeStyles(theme => ({
	buttonArea: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	summary: {
		borderRadius: theme.spacing(1),
		boxShadow: theme.shadows[1],
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
}));

const Dashboard = ({
	setAlert,
	businessError,
	clientError,
	expensesError,
	invoicesError,
	taxYearInvoices,
	taxYearExpenses,
	receipts,
	expenses,
	mileage,
	clients,
	invoicesProduced,
	overdueInvoices,
	invoices,
}) => {
	const classes = useStyles();
	const [dashBoard, setDashBoard] = useState({
		numberOfInvoices: undefined,
		numberOfClients: undefined,
		receipts: undefined,
		deductions: undefined,
		income: undefined,
	});
	const totalDeductions = (expenses, mileage) => {
		return numeral(expenses.value()).add(mileage.value());
	};
	const declaredIncome = (receipts, expenses, mileage) => {
		const amount = numeral(expenses.value()).add(mileage.value());
		const total = numeral(receipts.value()).subtract(amount.value());
		return total;
	};
	const generateDashboard = () => {
		const moneyOut = totalDeductions(expenses, mileage);
		const income = declaredIncome(receipts, expenses, mileage);
		const dashData = {
			numberOfInvoices: invoicesProduced,
			numberOfClients: clients,
			receipts: numeral(receipts).format(),
			deductions: numeral(moneyOut).format(),
			income: numeral(income).format(),
		};
		setDashBoard(dashData);
	};

	useEffect(() => {
		if (businessError.error === 'notFound') {
			setAlert(businessError.msg, 'warn');
		}
		if (clientError.error === 'notFound') {
			setAlert(clientError.msg, 'warn');
		}
		if (expensesError.error === 'notFound') {
			setAlert(expensesError.msg, 'warn');
		}
		if (invoicesError.error === 'notFound') {
			setAlert(invoicesError.msg, 'warn');
		}
		if (receipts && mileage && expenses) {
			generateDashboard();
		}
	}, [
		taxYearInvoices,
		taxYearExpenses,
		receipts,
		expenses,
		mileage,
		clients,
		invoicesProduced,
		overdueInvoices,
		invoices,
	]);

	return (
		<Fragment>
			<Container className={classes.buttonArea}>
				<AddInvoice />
				<AddClient />
				<AddExpense />
			</Container>
			<DashSummary dashBoard={dashBoard} />

			{overdueInvoices.length > 0 && (
				<Container className={classes.summary}>
					<Typography variant="h6" component="h2">
						Invoices due:{' '}
					</Typography>
					{overdueInvoices &&
						overdueInvoices.map(invoice => (
							<InvoiceCard key={invoice._id} invoice={invoice} />
						))}
					<EditInvoice />
					<DeleteInvoiceDialog />
				</Container>
			)}
		</Fragment>
	);
};
const getTaxYearDates = () => {
	let taxYearStart;
	let taxYearEnd;
	if (
		moment().utc() < moment(`${moment().year()}-04-05`).endOf('day')
	) {
		const year = moment().year() - 1;
		taxYearStart = moment(`${year}-04-06`)
			.utc()
			.startOf('day');
		taxYearEnd = moment(`${moment().year()}-04-05`)
			.utc()
			.endOf('day');
	} else {
		const year = moment().year() + 1;
		taxYearStart = moment(`${moment().year()}-04-06`)
			.utc()
			.startOf('day');
		taxYearEnd = moment(`${year}-04-05`)
			.utc()
			.endOf('day');
	}
	return { from: taxYearStart, to: taxYearEnd };
};
const filterByTaxYear = data => {
	const { from, to } = getTaxYearDates();
	return data.filter(d =>
		moment(d.date).utc() > from && moment(d.date).utc() < to
			? d
			: null
	);
};
const earnedSoFar = data => {
	const { from, to } = getTaxYearDates();
	return data
		.filter(d => (d.paid === true ? d : null))
		.filter(d =>
			moment(d.datePaid).utc() > from && moment(d.datePaid).utc() < to
				? d
				: null
		)
		.map(inv => inv.total)
		.reduce((a, b) => numeral(a).add(b), numeral(0));
};
const expensesTotalPerTaxYear = data => {
	const { from, to } = getTaxYearDates();
	return data
		.filter(d =>
			moment(d.date).utc() > from && moment(d.date).utc() < to
				? d
				: null
		)
		.map(inv => inv.amount)
		.reduce((a, b) => numeral(a).add(b), numeral(0));
};
const mileageExpensesByTaxYear = data => {
	const { from, to } = getTaxYearDates();
	return data
		.filter(d =>
			d.business.useMileage === true &&
			moment(d.date).utc() > from &&
			moment(d.date).utc() < to
				? d
				: null
		)
		.map(invoice => parseFloat(invoice.mileage * 0.45).toFixed(2))
		.reduce((a, b) => numeral(a).add(b), numeral(0));
};
const numberOfClients = data => {
	return Array.from(new Set(data.map(inv => inv.client.name))).length;
};
const unPaidByTaxYear = data => {
	const { from, to } = getTaxYearDates();
	return data
		.filter(d =>
			moment(d.date).utc() > from && moment(d.date).utc() < to
				? d
				: null
		)
		.filter(inv => (!inv.paid ? inv : null))
		.sort((a, b) => (a.date > b.date ? 1 : -1));
};

Dashboard.propTypes = {
	setAlert: PropTypes.func.isRequired,
	businessError: PropTypes.string,
	clientError: PropTypes.string,
	expensesError: PropTypes.string,
	invoicesError: PropTypes.string,
	taxYearInvoices: PropTypes.arrayOf(
		PropTypes.shape({
			invNo: PropTypes.number.isRequired,
			mileage: PropTypes.number,
			message: PropTypes.string.isRequired,
			total: PropTypes.string.isRequired,
			_id: PropTypes.string.isRequired,
			date: PropTypes.string.isRequired,
			paid: PropTypes.bool.isRequired,
			client: PropTypes.shape({
				_id: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired,
				email: PropTypes.string.isRequired,
				phone: PropTypes.string.isRequired,
				add1: PropTypes.string.isRequired,
				add2: PropTypes.string,
				add3: PropTypes.string,
				postCode: PropTypes.string.isRequired,
				greeting: PropTypes.string.isRequired,
			}).isRequired,
			business: PropTypes.shape({
				_id: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired,
				email: PropTypes.string.isRequired,
				phone: PropTypes.string.isRequired,
				add1: PropTypes.string.isRequired,
				add2: PropTypes.string,
				add3: PropTypes.string,
				postCode: PropTypes.string.isRequired,
				bankName: PropTypes.string.isRequired,
				accountNo: PropTypes.string.isRequired,
				sortCode: PropTypes.string.isRequired,
				utr: PropTypes.string.isRequired,
				terms: PropTypes.string.isRequired,
				farewell: PropTypes.string.isRequired,
				contact: PropTypes.string.isRequired,
				useMileage: PropTypes.bool.isRequired,
			}),
			items: PropTypes.arrayOf(
				PropTypes.shape({
					date: PropTypes.string.isRequired,
					desc: PropTypes.string.isRequired,
					fee: PropTypes.string.isRequired,
					id: PropTypes.string.isRequired,
				})
			),
		})
	),
	taxYearExpenses: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			date: PropTypes.string.isRequired,
			category: PropTypes.string.isRequired,
			amount: PropTypes.string.isRequired,
			desc: PropTypes.string.isRequired,
		})
	),
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
	}).isRequired,
	expenses: PropTypes.shape({
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
	}).isRequired,
	mileage: PropTypes.shape({
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
	}).isRequired,
	clients: PropTypes.number.isRequired,
	invoicesProduced: PropTypes.number.isRequired,
	invoices: PropTypes.arrayOf(
		PropTypes.shape({
			invNo: PropTypes.number.isRequired,
			mileage: PropTypes.number,
			message: PropTypes.string.isRequired,
			total: PropTypes.string.isRequired,
			_id: PropTypes.string.isRequired,
			date: PropTypes.string.isRequired,
			paid: PropTypes.bool.isRequired,
			client: PropTypes.shape({
				_id: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired,
				email: PropTypes.string.isRequired,
				phone: PropTypes.string.isRequired,
				add1: PropTypes.string.isRequired,
				add2: PropTypes.string,
				add3: PropTypes.string,
				postCode: PropTypes.string.isRequired,
				greeting: PropTypes.string.isRequired,
			}).isRequired,
			business: PropTypes.shape({
				_id: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired,
				email: PropTypes.string.isRequired,
				phone: PropTypes.string.isRequired,
				add1: PropTypes.string.isRequired,
				add2: PropTypes.string,
				add3: PropTypes.string,
				postCode: PropTypes.string.isRequired,
				bankName: PropTypes.string.isRequired,
				accountNo: PropTypes.string.isRequired,
				sortCode: PropTypes.string.isRequired,
				utr: PropTypes.string.isRequired,
				terms: PropTypes.string.isRequired,
				farewell: PropTypes.string.isRequired,
				contact: PropTypes.string.isRequired,
				useMileage: PropTypes.bool.isRequired,
			}),
			items: PropTypes.arrayOf(
				PropTypes.shape({
					date: PropTypes.string.isRequired,
					desc: PropTypes.string.isRequired,
					fee: PropTypes.string.isRequired,
					id: PropTypes.string.isRequired,
				})
			),
		})
	),
	overdueInvoices: PropTypes.arrayOf(
		PropTypes.shape({
			invNo: PropTypes.number.isRequired,
			mileage: PropTypes.number,
			message: PropTypes.string.isRequired,
			total: PropTypes.string.isRequired,
			_id: PropTypes.string.isRequired,
			date: PropTypes.string.isRequired,
			paid: PropTypes.bool.isRequired,
			client: PropTypes.shape({
				_id: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired,
				email: PropTypes.string.isRequired,
				phone: PropTypes.string.isRequired,
				add1: PropTypes.string.isRequired,
				add2: PropTypes.string,
				add3: PropTypes.string,
				postCode: PropTypes.string.isRequired,
				greeting: PropTypes.string.isRequired,
			}).isRequired,
			business: PropTypes.shape({
				_id: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired,
				email: PropTypes.string.isRequired,
				phone: PropTypes.string.isRequired,
				add1: PropTypes.string.isRequired,
				add2: PropTypes.string,
				add3: PropTypes.string,
				postCode: PropTypes.string.isRequired,
				bankName: PropTypes.string.isRequired,
				accountNo: PropTypes.string.isRequired,
				sortCode: PropTypes.string.isRequired,
				utr: PropTypes.string.isRequired,
				terms: PropTypes.string.isRequired,
				farewell: PropTypes.string.isRequired,
				contact: PropTypes.string.isRequired,
				useMileage: PropTypes.bool.isRequired,
			}),
			items: PropTypes.arrayOf(
				PropTypes.shape({
					date: PropTypes.string.isRequired,
					desc: PropTypes.string.isRequired,
					fee: PropTypes.string.isRequired,
					id: PropTypes.string.isRequired,
				})
			),
		})
	),
};

const mapStateToProps = state => ({
	businessError: state.business.error,
	clientError: state.clients.error,
	expensesError: state.expenses.error,
	invoicesError: state.invoices.error,
	invoices: state.invoices.invoices,
	taxYearInvoices: filterByTaxYear(state.invoices.invoices),
	taxYearExpenses: filterByTaxYear(state.expenses.expenses),
	receipts: earnedSoFar(state.invoices.invoices),
	expenses: expensesTotalPerTaxYear(state.expenses.expenses),
	mileage: mileageExpensesByTaxYear(state.invoices.invoices),
	clients: numberOfClients(filterByTaxYear(state.invoices.invoices)),
	invoicesProduced: filterByTaxYear(state.invoices.invoices).length,
	overdueInvoices: unPaidByTaxYear(state.invoices.invoices),
});

export default connect(
	mapStateToProps,
	{ setAlert }
)(Dashboard);
