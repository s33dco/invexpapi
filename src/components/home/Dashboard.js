import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import numeral from 'numeral';
import { AST_False } from 'terser';
import { getBusiness } from '../../actions/businessActions';
import { getClients } from '../../actions/clientsActions';
import { getExpenses } from '../../actions/expensesActions';
import { getInvoices } from '../../actions/invoicesActions';
import { setAlert } from '../../actions/alertActions';
import InvoiceCard from '../invoices/InvoiceCard';
import EditInvoice from '../invoices/EditInvoice';
import DeleteInvoiceDialog from '../invoices/DeleteInvoiceDialog';

numeral.locale('en-gb');
numeral.defaultFormat('$0,0.00');

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
	overdueInvoices
}) => {
	const [deductions, setDeductions] = useState(false);
	const [income, setIncome] = useState(false);
	const [loading, setLoading] = useState(true);

	const totalDeductions = (expenses, mileage) => {
		setDeductions(numeral(expenses).add(mileage));
	};

	const declaredIncome = (receipts, exps, miles) => {
		const hmrc = numeral(exps).add(miles);
		setIncome(numeral(receipts).subtract(hmrc));
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
			totalDeductions(expenses, mileage);
			declaredIncome(receipts, expenses, mileage);
			setLoading(false);
		}
	}, [taxYearInvoices, taxYearExpenses]);

	if (loading) {
		return <Typography> Loading DashBoard!</Typography>;
	}
	return (
		<Container>
			<Container>
				<Typography>Income to declare : {numeral(income).format()}</Typography>
				<Typography>Working with {clients} clients.</Typography>
				<Typography>producing {invoicesProduced} invoices.</Typography>

				<Typography>
					Receipts so far this tax year : {numeral(receipts).format()}
				</Typography>
				<Typography>
					Deductions so far this tax year : {numeral(deductions).format()}
				</Typography>
			</Container>
			{overdueInvoices.length > 0 && <Typography>Invoices due: </Typography>}
			{overdueInvoices &&
				overdueInvoices.map(invoice => (
					<InvoiceCard key={invoice._id} invoice={invoice} />
				))}
			<EditInvoice />
			<DeleteInvoiceDialog />
		</Container>
	);
};
Dashboard.propTypes = {};

const getTaxYearDates = () => {
	let taxYearStart;
	let taxYearEnd;
	if (moment().utc() < moment(`${moment().year()}-04-05`).endOf('day')) {
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
		moment(d.date).utc() > from && moment(d.date).utc() < to ? d : null
	);
};
const earnedSoFar = data => {
	const { from, to } = getTaxYearDates();
	return data
		.filter(d =>
			moment(d.datePaid).utc() > from && moment(d.datePaid).utc() < to
				? d
				: null
		)
		.map(inv => inv.total)
		.reduce((a, b) => numeral(a).add(b), 0);
};
const expensesTotalPerTaxYear = data => {
	const { from, to } = getTaxYearDates();
	return data
		.filter(d =>
			moment(d.date).utc() > from && moment(d.date).utc() < to ? d : null
		)
		.map(inv => inv.amount)
		.reduce((a, b) => numeral(a).add(b), 0);
};
const mileageExpensesByTaxYear = data => {
	const { from, to } = getTaxYearDates();
	return data
		.filter(d =>
			moment(d.date).utc() > from && moment(d.date).utc() < to ? d : null
		)
		.map(invoice => parseFloat(invoice.mileage * 0.45).toFixed(2))
		.reduce((a, b) => numeral(a).add(b), 0);
};
const numberOfClients = data => {
	return Array.from(new Set(data.map(inv => inv.client.name))).length;
};

const unPaidByTaxYear = data => {
	const { from, to } = getTaxYearDates();
	return data
		.filter(d =>
			moment(d.date).utc() > from && moment(d.date).utc() < to ? d : null
		)
		.filter(inv => (!inv.paid ? inv : null))
		.sort((a, b) => (a.date > b.date ? 1 : -1));
};

const mapStateToProps = state => ({
	businessError: state.business.error,
	clientError: state.clients.error,
	expensesError: state.expenses.error,
	invoicesError: state.invoices.error,
	taxYearInvoices: filterByTaxYear(state.invoices.invoices),
	taxYearExpenses: filterByTaxYear(state.expenses.expenses),
	receipts: earnedSoFar(state.invoices.invoices),
	expenses: expensesTotalPerTaxYear(state.expenses.expenses),
	mileage: mileageExpensesByTaxYear(state.invoices.invoices),
	clients: numberOfClients(filterByTaxYear(state.invoices.invoices)),
	invoicesProduced: filterByTaxYear(state.invoices.invoices).length,
	overdueInvoices: unPaidByTaxYear(state.invoices.invoices)
});

export default connect(
	mapStateToProps,
	{ getBusiness, getClients, setAlert }
)(Dashboard);
