import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import numeral from 'numeral';
import { titleCase } from '../../../config/textFormat';
import Selector from './Selector';
import Charts from './Charts';

const Reports = ({ invoices, expenses }) => {
	const [startDate, setStartDate] = useState(moment().utc());
	const [endDate, setEndDate] = useState(moment().utc());
	const [formError, setFormError] = useState({
		start: '0',
		end: '0',
	});
	const [reportData, setReportData] = useState({});
	const [showReport, setShowReport] = useState(false);

	const generateReport = async () => {
		const invoiceItems = reportInvoices();
		const expenseItems = reportExpenses();
		const mileageItems = mileageExpenses();
		const moneyIn = [...invoiceItems];
		const moneyOut = [...expenseItems, ...mileageItems];
		const data = [...invoiceItems, ...expenseItems, ...mileageItems];
		const totalOutgoings = addUpOutgoings([
			...expenseItems,
			...mileageItems,
		]);
		const totalIncomings = addUpIncomings([...invoiceItems]);
		const takeHome = calculateIncome(totalIncomings, totalOutgoings);
		const incomePie = breakoutFigures([...moneyIn]);
		const deductionsPie = breakoutFiguresPositive([...moneyOut]);
		const tableData = toSortedArray(data);
		const newReport = {
			start: startDate,
			end: endDate,
			declaredIncome: takeHome,
			totalOutgoings,
			totalIncomings,
			incomePie,
			deductionsPie,
			tableData,
		};
		setReportData(newReport);
		setShowReport(true);
	};

	useEffect(() => {
		// when dates set...
		if (formError.start === '1' && formError.end === '1') {
			setFormError({ ...formError, start: '0', end: '0' });
			generateReport();
		}
	}, [formError, startDate, endDate, reportData, showReport]);

	const calculateIncome = (incomings, outgoings) => {
		return numeral(incomings.value()).add(outgoings.value());
	};

	const clearReport = () => {
		setStartDate(moment().utc());
		setEndDate(moment().utc());
		setShowReport(false);
		setReportData({});
	};

	const toSortedArray = data => {
		return data
			.map(Object.values)
			.sort((a, b) => (a[0] > b[0] ? 1 : -1))
			.map(a => {
				const copy = [...a];
				copy[0] = moment(a[0]).format('Do MMM YYYY');
				return copy;
			});
	};

	const breakoutFigures = data => {
		const sorted = data.reduce((obj, item) => {
			if (item.desc in obj) {
				obj[item.desc] = obj[item.desc].add(item.total);
			} else {
				obj[item.desc] = numeral(item.total);
			}
			return obj;
		}, {});

		const pieFormat = { ...sorted };
		delete pieFormat.date;
		delete pieFormat.category;

		const pieSlices = Object.entries(pieFormat).map(item => {
			const obj = {
				id: item[0],
				label: item[0],
				value: Number(parseFloat(item[1].value()).toFixed(2)),
			};
			return obj;
		});
		return pieSlices;
	};

	const breakoutFiguresPositive = data => {
		const sorted = data.reduce((obj, item) => {
			if (item.desc in obj) {
				obj[item.desc] = obj[item.desc].add(item.total);
			} else {
				obj[item.desc] = numeral(item.total);
			}
			return obj;
		}, {});

		const pieFormat = { ...sorted };
		delete pieFormat.date;
		delete pieFormat.category;

		const pieSlices = Object.entries(pieFormat).map(item => {
			const obj = {
				id: item[0],
				label: item[0],
				value: Number(parseFloat(item[1].value() * -1).toFixed(2)),
			};
			return obj;
		});
		return pieSlices;
	};

	const addUpIncomings = incomings =>
		incomings
			.map(inv => inv.total)
			.reduce((a, b) => numeral(a).add(b), numeral(0));

	const addUpOutgoings = outgoings =>
		outgoings
			.map(exp => exp.total)
			.reduce((a, b) => numeral(a).add(b), numeral(0));

	const reportInvoices = () =>
		invoices
			.filter(invoice =>
				invoice.paid === true &&
				invoice.datePaid > startDate.toISOString() &&
				invoice.datePaid < endDate.toISOString()
					? invoice
					: null
			)
			.map(invoice => {
				const data = {
					date: moment(invoice.datePaid).utc(),
					category: `Inv${invoice.invNo}`,
					desc: `${titleCase(invoice.client.name)}`,
					total: parseFloat(invoice.total).toFixed(2),
				};
				return data;
			});

	const reportExpenses = () =>
		expenses
			.filter(expense =>
				expense.date > startDate.toISOString() &&
				expense.date < endDate.toISOString()
					? expense
					: null
			)
			.map(exp => {
				const data = {
					date: moment(exp.date).utc(),
					category: titleCase(exp.desc),
					desc: titleCase(exp.category),
					total: parseFloat(exp.amount * -1).toFixed(2),
				};
				return data;
			});

	const mileageExpenses = () =>
		invoices
			.filter(invoice =>
				invoice.business.useMileage === true &&
				invoice.date > startDate.toISOString() &&
				invoice.date < endDate.toISOString()
					? invoice
					: null
			)
			.map(invoice => {
				const data = {
					date: moment(invoice.date).utc(),
					category: `Inv${invoice.invNo}`,
					desc: 'Mileage',
					total: parseFloat(invoice.mileage * -1 * 0.45).toFixed(2),
				};
				return data;
			});

	const handleStartDate = e => {
		setStartDate(e.startOf('day'));
		startDate > endDate
			? setFormError({
					...formError,
					start: 'start date should be before end date',
			  })
			: setFormError({ ...formError, start: '1' });
	};

	const handleEndDate = e => {
		setEndDate(e.endOf('day'));
		endDate < startDate
			? setFormError({
					...formError,
					end: 'end date should be after start date',
			  })
			: setFormError({ ...formError, end: '1' });
	};

	return (
		<Fragment>
			{!showReport ? (
				<Selector
					invoices={invoices.length}
					expenses={expenses.length}
					startDate={startDate}
					endDate={endDate}
					handleStartDate={handleStartDate}
					handleEndDate={handleEndDate}
					formError={formError}
				/>
			) : (
				<Charts clearReport={clearReport} reportData={reportData} />
			)}
		</Fragment>
	);
};

Reports.propTypes = {};

const mapStateToProps = state => ({
	invoices: state.invoices.invoices,
	expenses: state.expenses.expenses,
});

export default connect(mapStateToProps)(Reports);
