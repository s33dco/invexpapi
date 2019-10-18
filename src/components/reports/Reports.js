import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import moment from 'moment';
import numeral from 'numeral';
import {
	createMuiTheme,
	MuiThemeProvider,
	makeStyles
} from '@material-ui/core/styles';
import { DatePicker } from '@material-ui/pickers';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
// import { PieChart, Pie, Legend, Tooltip } from 'recharts';
import titleCase from '../../../config/titleCase';

const useStyles = makeStyles(theme => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
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
	dates: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		margin: theme.spacing(1, 0, 3),
		padding: theme.spacing(2, 1),
		borderRadius: theme.spacing(2)
	},
	'@media (min-width: 600px)': {
		paper: {
			width: '50vw'
		}
	},
	datePicker: {
		margin: theme.spacing(2, 0),
		width: '100%'
	},
	textField: {
		marginLeft: '0',
		marginRight: '0',
		width: '100%'
	}
}));

const Reports = ({ invoices, expenses }) => {
	const getMuiTheme = () =>
		createMuiTheme({
			overrides: {
				MUIDataTableBodyCell: {
					root: {
						maxWidth: '18%'
					}
				},
				MUIDataTableHeadCell: {
					root: {
						maxWidth: '18%'
					}
				}
			}
		});

	const classes = useStyles();
	const [startDate, setStartDate] = useState(moment().utc());
	const [endDate, setEndDate] = useState(moment().utc());
	const [formError, setFormError] = useState({ start: '0', end: '0' });
	const [incomings, setIncomings] = useState([]);
	const [outgoings, setOutgoings] = useState([]);
	const [tableData, setTableData] = useState(false);
	const [showTable, setShowTable] = useState(false);
	const [totalIncomings, setTotalIncomings] = useState();
	const [totalOutgoings, setTotalOutgoings] = useState();
	const [incomePie, setIncomePie] = useState();
	const [deductionsPie, setDeductionsPie] = useState();
	const [showPieChart, setShowPieChart] = useState();

	useEffect(() => {
		if (formError.start === '1' && formError.end === '1') {
			setFormError({ ...formError, start: '0', end: '0' });
			const invoiceItems = reportInvoices();
			const expenseItems = reportExpenses();
			const mileageItems = mileageExpenses();
			setIncomings([...invoiceItems]);
			setOutgoings([...expenseItems, ...mileageItems]);
			const data = [...invoiceItems, ...expenseItems, ...mileageItems];
			setTableData(toSortedArray(data));
			const totalOutgoings = addUpOutgoings([...expenseItems, ...mileageItems]);
			const totalIncomings = addUpIncomings([...invoiceItems]);
			setTotalIncomings(totalIncomings);
			setTotalOutgoings(totalOutgoings);
			setIncomePie(breakoutFigures(incomings));
			setDeductionsPie(breakoutFigures(outgoings));
		}
		if (tableData) {
			setShowTable(true);
		}

		if (incomePie && deductionsPie) {
			setShowPieChart(true);
		}
	}, [
		startDate,
		endDate,
		incomings,
		outgoings,
		tableData,
		showTable,
		totalIncomings,
		totalOutgoings,
		incomePie,
		deductionsPie
	]);

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

		return Object.entries(pieFormat).map(item => {
			const obj = {
				name: item[0],
				value: parseFloat(item[1]._value).toFixed(2) // convert this to a abs Number?
			};
			return obj;
		});
	};

	const addUpIncomings = incomings =>
		incomings.map(inv => inv.total).reduce((a, b) => numeral(a).add(b), 0);

	const addUpOutgoings = outgoings =>
		outgoings.map(exp => exp.total).reduce((a, b) => numeral(a).add(b), 0);

	const reportInvoices = () =>
		invoices
			.filter(invoice => (invoice.paid === true ? invoice : null))
			.filter(invoice =>
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
					total: invoice.total
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
					total: `-${exp.amount}`
				};
				return data;
			});

	const mileageExpenses = () =>
		invoices
			.filter(invoice =>
				invoice.business.useMileage === true ? invoice : null
			)
			.map(invoice => {
				const data = {
					date: moment(invoice.date).utc(),
					category: `Inv${invoice.invNo}`,
					desc: 'Mileage',
					total: `-${parseFloat(invoice.mileage * 0.45).toFixed(2)}`
				};
				return data;
			});

	const handleStartDate = e => {
		setStartDate(e.startOf('day'));
		startDate > endDate
			? setFormError({
					...formError,
					start: 'start date should be before end date'
			  })
			: setFormError({ ...formError, start: '1' });
	};

	const handleEndDate = e => {
		setEndDate(e.endOf('day'));
		endDate < startDate
			? setFormError({
					...formError,
					end: 'end date should be after start date'
			  })
			: setFormError({ ...formError, end: '1' });
	};

	return (
		<Fragment>
			<h1>Reports</h1>
			<Container className={classes.dates}>
				<DatePicker
					disableFuture
					maxDate={moment(endDate).utc()}
					label="Start Date"
					value={startDate}
					onChange={handleStartDate}
					error={!(formError.start.length === 1)}
					helperText={formError.start.length > 1 ? formError.start : ''}
					format="Do MMMM YYYY"
					animateYearScrolling
				/>
				<DatePicker
					label="End Date"
					minDate={moment(startDate).utc()}
					value={endDate}
					onChange={handleEndDate}
					error={!(formError.end.length === 1)}
					helperText={formError.end.length > 1 ? formError.end : ''}
					format="Do MMMM YYYY"
					animateYearScrolling
				/>
			</Container>
			{showTable && (
				<Fragment>
					<MuiThemeProvider theme={getMuiTheme()}>
						<MUIDataTable
							title={`${moment(startDate).format('Do MMM YYYY')} - ${moment(
								endDate
							).format('Do MMM YYYY')}`}
							data={tableData}
							columns={[
								{
									name: 'Date',
									options: {
										filter: true,
										sort: false
									}
								},
								{
									name: 'Details',
									options: {
										filter: true,
										sort: false
									}
								},
								{
									name: 'Reference',
									options: {
										filter: false,
										sort: false
									}
								},
								{
									name: '£',
									options: {
										filter: true,
										sort: false
									}
								}
							]}
							options={{
								filter: true,
								sort: false,
								filterType: 'dropdown',
								responsive: 'scrollMaxHeight',
								selectableRows: 'none',
								pagination: false
							}}
						/>
					</MuiThemeProvider>
				</Fragment>
			)}
			{/* {showPieChart && (
				<PieChart width={300} height={300}>
					<Pie
						isAnimationActive
						data={incomePie}
						cx={200}
						cy={200}
						dataKey="value"
						nameKey="name"
						outerRadius={80}
						fill="#8884d8"
						label
					/>
					<Tooltip />
				</PieChart>
				<PieChart width={300} height={300}>
					<Pie
						isAnimationActive
						data={deductionsPie}
						cx={200}
						cy={200}
						dataKey="value"
						nameKey="name"
						outerRadius={80}
						fill="#8884d8"
						label
					/>
					<Tooltip />
				</PieChart>
			)} */}
		</Fragment>
	);
};

Reports.propTypes = {};

const mapStateToProps = state => ({
	invoices: state.invoices.invoices,
	error: state.reports.error,
	expenses: state.expenses.expenses
});

export default connect(mapStateToProps)(Reports);
