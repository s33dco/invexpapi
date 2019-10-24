import React from 'react';
import PropTypes from 'prop-types';
import { pdf, BlobProvider } from '@react-pdf/renderer';
import MUIDataTable from 'mui-datatables';
import moment from 'moment';
import numeral from 'numeral';
import {
	createMuiTheme,
	MuiThemeProvider,
	makeStyles
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import { ResponsivePie } from '@nivo/pie';
import { saveAs } from 'file-saver';
import Table from './Table';
import SummaryPDF from './SummaryPDF';

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
	pieArea: {
		// marginLeft: '2.5vw',
		// marginRight: '2.5vw',
		// marginTop: '2.5vh',
		marginBottom: '2.5vh'
		// height: '35vh'
	},
	pieTitle: {
		height: '2.5vh',
		marginBottom: '1vh'
	},
	pieChart: {
		height: '30vh'
		// width: '60vh',
		// margin: '0 auto'
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
	}
}));

const Charts = ({ reportData, clearReport }) => {
	const classes = useStyles();

	const downloadSummary = async invoice => {
		const doc = await pdf(<SummaryPDF data={reportData} />).toBlob();
		saveAs(
			doc,
			`Summary-${moment(reportData.start).format('DD/MM/YYYY')}-${moment(
				reportData.end
			).format('DD/MM/YYYY')}`
		);
	};

	return (
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
				<Typography className={classes.pieTitle} variant="body2" component="h3">
					Receipts {numeral(reportData.totalIncomings).format()}
				</Typography>
				{reportData.incomePie.length > 0 && (
					<Container className={classes.pieChart}>
						<ResponsivePie
							data={[...reportData.incomePie]}
							margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
							sortByValue
							innerRadius={0}
							padAngle={1}
							cornerRadius={5}
							fit={false}
							startAngle={-90}
							endAngle={270}
							colors={{ scheme: 'set1' }}
							borderWidth={1}
							borderColor={{
								from: 'color',
								modifiers: [['darker', '0.3']]
							}}
							enableRadialLabels={false}
							// radialLabelsSkipAngle={3}
							// radialLabelsTextXOffset={0}
							// radialLabelsTextColor="#333333"
							// radialLabelsLinkOffset={3}
							// radialLabelsLinkDiagonalLength={0}
							// radialLabelsLinkHorizontalLength={12}
							// radialLabelsLinkStrokeWidth={1}
							// radialLabelsLinkColor={{ from: 'color' }}
							// slicesLabelsSkipAngle={0}
							// slicesLabelsTextColor="#333333"
							enableSlicesLabels={false}
							animate
							motionStiffness={90}
							motionDamping={15}
							tooltipFormat={value => numeral(value).format()}
							// legends={[
							// 	{
							// 		anchor: 'left',
							// 		direction: 'column',
							// 		itemWidth: 180,
							// 		itemHeight: 15,
							// 		itemTextColor: '#000',
							// 		symbolSize: 15,
							// 		symbolShape: 'circle'
							// 	}
							// ]}
						/>
					</Container>
				)}
			</Container>
			<Container className={classes.pieArea}>
				<Typography className={classes.pieTitle} variant="body2" component="h3">
					Deductions {numeral(reportData.totalOutgoings).format()}
				</Typography>
				{reportData.deductionsPie.length > 0 && (
					<Container className={classes.pieChart}>
						<ResponsivePie
							data={[...reportData.deductionsPie]}
							margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
							sortByValue
							innerRadius={0}
							padAngle={1}
							cornerRadius={5}
							fit={false}
							startAngle={-90}
							endAngle={270}
							colors={{ scheme: 'set1' }}
							borderWidth={1}
							borderColor={{
								from: 'color',
								modifiers: [['darker', '0.3']]
							}}
							enableRadialLabels={false}
							// radialLabelsSkipAngle={3}
							// radialLabelsTextXOffset={0}
							// radialLabelsTextColor="#333333"
							// radialLabelsLinkOffset={3}
							// radialLabelsLinkDiagonalLength={0}
							// radialLabelsLinkHorizontalLength={12}
							// radialLabelsLinkStrokeWidth={1}
							// radialLabelsLinkColor={{ from: 'color' }}
							// slicesLabelsTextColor="#333333"
							enableSlicesLabels={false}
							animate
							motionStiffness={90}
							motionDamping={15}
							tooltipFormat={value => numeral(value).format()}
							// legends={[
							// 	{
							// 		anchor: 'left',
							// 		direction: 'column',
							// 		itemWidth: 180,
							// 		itemHeight: 15,
							// 		itemTextColor: '#000',
							// 		symbolSize: 15,
							// 		symbolShape: 'circle'
							// 	}
							// ]}
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
				<Fab
					aria-label="clear report"
					className={classes.fab}
					color="primary"
					onClick={() => downloadSummary()}
					size="small"
					variant="extended"
				>
					summary
				</Fab>
				<Table
					tableData={reportData.tableData}
					startDate={reportData.start}
					endDate={reportData.end}
				/>
			</Container>
		</Container>
	);
};

Charts.propTypes = {};

export default Charts;
