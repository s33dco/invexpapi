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
import Fab from '@material-ui/core/Fab';
import { ResponsivePie } from '@nivo/pie';
import titleCase from '../../../config/titleCase';
import Table from './Table';

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
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		margin: theme.spacing(1, 0, 3),
		padding: theme.spacing(2, 1),
		borderRadius: theme.spacing(2)
	},
	datePicker: {
		margin: theme.spacing(3, 3, 3, 3),
		padding: theme.spacing(2, 2, 2, 2)
	},
	pieArea: {
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		marginBottom: '2vh'
	},
	pieTitle: {
		height: '3vh',
		marginBottom: '2vh'
	},
	pieChart: {
		height: '27.5vh'
	},
	buttonArea: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly'
	},
	results: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		marginTop: '2.5vh'
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
	const classes = useStyles();
	const [startDate, setStartDate] = useState(moment().utc());
	const [endDate, setEndDate] = useState(moment().utc());
	const [formError, setFormError] = useState({ start: '0', end: '0' });
	const [reportData, setReportData] = useState({});
	const [showReport, setShowReport] = useState(false);

	const generateReport = async () => {
		const invoiceItems = reportInvoices();
		console.log('invoiceitems', invoiceItems);
		const expenseItems = reportExpenses();
		console.log('expenseItems', expenseItems);
		const mileageItems = mileageExpenses();
		console.log('mileageItems', mileageItems);
		const moneyIn = [...invoiceItems];
		console.log('moneyIn', moneyIn);
		const moneyOut = [...expenseItems, ...mileageItems];
		console.log('moneyOut', moneyOut);
		const data = [...invoiceItems, ...expenseItems, ...mileageItems];
		const totalOutgoings = addUpOutgoings([...expenseItems, ...mileageItems]);
		console.log('totalOutgoings', totalOutgoings);
		const totalIncomings = addUpIncomings([...invoiceItems]);
		console.log('totalIncomings', totalIncomings);
		const takeHome = calculateIncome(totalIncomings, totalOutgoings);
		const incomePie = breakoutFigures([...moneyIn]);
		const deductionsPie = breakoutFiguresPositive([...moneyOut]);
		const tableData = toSortedArray(data);
		setTimeout(() => {
			const newReport = {
				start: startDate,
				end: endDate,
				declaredIncome: takeHome,
				totalOutgoings,
				totalIncomings,
				incomePie,
				deductionsPie,
				tableData
			};
			setReportData(newReport);
			setShowReport(true);
		}, 3000);
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
		console.log('data', data);
		const sorted = data.reduce((obj, item) => {
			if (item.desc in obj) {
				obj[item.desc] = obj[item.desc].add(item.total);
			} else {
				obj[item.desc] = numeral(item.total);
			}
			return obj;
		}, {});

		console.log('sorted', sorted);

		const pieFormat = { ...sorted };
		console.log('pieformat', pieFormat);
		delete pieFormat.date;
		delete pieFormat.category;

		const pieSlices = Object.entries(pieFormat).map(item => {
			const obj = {
				id: item[0],
				label: item[0],
				value: parseFloat(item[1].value()).toFixed(2)
			};
			return obj;
		});
		console.log('pieSlices', pieSlices);
		return pieSlices;
	};

	const breakoutFiguresPositive = data => {
		console.log('data', data);
		const sorted = data.reduce((obj, item) => {
			if (item.desc in obj) {
				obj[item.desc] = obj[item.desc].add(item.total);
			} else {
				obj[item.desc] = numeral(item.total).multiply(-1);
			}
			return obj;
		}, {});

		console.log('sorted', sorted);

		const pieFormat = { ...sorted };
		console.log('pieformat', pieFormat);
		delete pieFormat.date;
		delete pieFormat.category;

		const pieSlices = Object.entries(pieFormat).map(item => {
			const obj = {
				id: item[0],
				label: item[0],
				value: parseFloat(item[1].value()).toFixed(2)
			};
			return obj;
		});
		console.log('pieSlices', pieSlices);
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
					total: parseFloat(invoice.total).toFixed(2)
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
					total: exp.amount * -1
				};
				return data;
			});

	const mileageExpenses = () =>
		invoices
			.filter(invoice =>
				invoice.business.useMileage === true ? invoice : null
			)
			.filter(invoice =>
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
					total: parseFloat(invoice.mileage * -1 * 0.45).toFixed(2)
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
			{!showReport && (
				<Container>
					<h1>Reports</h1>
					<Typography variant="body1" component="h3" align="center">
						Select the date ranges for a financial summary.
					</Typography>
					<Typography variant="body1" component="h3" align="center">
						The figures are broken down via the HMRC categories and available to
						print of download. Your end of year tax return is just a few clicks
						away!
					</Typography>
					{invoices.length === 0 && expenses.length === 0 && (
						<Typography variant="body1" component="h3" align="center">
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
								disabled={invoices.length === 0 && expenses.length === 0}
								onChange={handleStartDate}
								error={!(formError.start.length === 1)}
								helperText={formError.start.length > 1 ? formError.start : ''}
								format="Do MMMM YYYY"
								animateYearScrolling
							/>
						</Container>
						<Container className={classes.dates}>
							<DatePicker
								label="End Date"
								minDate={moment(startDate).utc()}
								disabled={invoices.length === 0 && expenses.length === 0}
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
			)}
			{showReport && (
				<Container className={classes.results}>
					<Typography
						className={classes.pieTitle}
						variant="body1"
						component="h3"
						align="center"
					>
						Summary {moment(reportData.start).format('DD/MM/YYYY')} to{' '}
						{moment(reportData.end).format('DD/MM/YYYY')}
					</Typography>
					<Typography
						className={classes.pieTitle}
						variant="body1"
						component="h3"
						align="center"
					>
						Income {numeral(reportData.declaredIncome).format()}
					</Typography>
					<Container className={classes.pieArea}>
						<Typography
							className={classes.pieTitle}
							variant="body2"
							component="h3"
						>
							Receipts {numeral(reportData.totalIncomings).format()}
						</Typography>
						{reportData.incomePie.length > 0 && (
							<Container className={classes.pieChart}>
								<ResponsivePie
									data={[...reportData.incomePie]}
									margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
									sortByValue
									pieLegends={0}
									innerRadius={0.5}
									padAngle={2}
									cornerRadius={5}
									fit={false}
									colors={{ scheme: 'set1' }}
									borderWidth={1}
									borderColor={{
										from: 'color',
										modifiers: [['darker', '0.3']]
									}}
									enableRadialLabels={false}
									enableSlicesLabels={false}
									animate
									motionStiffness={90}
									motionDamping={15}
									tooltipFormat={value => numeral(value).format()}
									legends={[
										{
											anchor: 'left',
											direction: 'column',
											itemWidth: 180,
											itemHeight: 15,
											itemTextColor: '#000',
											symbolSize: 15,
											symbolShape: 'circle'
										}
									]}
								/>
							</Container>
						)}
					</Container>
					<Container className={classes.pieArea}>
						<Typography
							className={classes.pieTitle}
							variant="body2"
							component="h3"
						>
							Deductions {numeral(reportData.totalOutgoings).format()}
						</Typography>
						{reportData.deductionsPie.length > 0 && (
							<Container className={classes.pieChart}>
								<ResponsivePie
									data={[...reportData.deductionsPie]}
									margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
									sortByValue
									innerRadius={0.5}
									padAngle={2}
									cornerRadius={5}
									fit={false}
									colors={{ scheme: 'set1' }}
									borderWidth={1}
									borderColor={{
										from: 'color',
										modifiers: [['darker', '0.3']]
									}}
									enableRadialLabels={false}
									enableSlicesLabels={false}
									animate
									motionStiffness={90}
									motionDamping={15}
									tooltipFormat={value => numeral(value).format()}
									legends={[
										{
											anchor: 'left',
											direction: 'column',
											itemWidth: 180,
											itemHeight: 15,
											itemTextColor: '#000',
											symbolSize: 15,
											symbolShape: 'circle'
										}
									]}
								/>
							</Container>
						)}
					</Container>
					<Container className={classes.buttonArea}>
						<Fab
							aria-label="clear report"
							className={classes.fab}
							color="primary"
							onClick={clearReport}
							size="small"
							variant="extended"
						>
							clear
						</Fab>
						<Table
							tableData={reportData.tableData}
							startDate={reportData.start}
							endDate={reportData.end}
						/>
					</Container>
				</Container>
			)}
			;
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
