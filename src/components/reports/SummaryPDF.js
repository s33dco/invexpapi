import React, { Fragment } from 'react';
import Icon from '@material-ui/core/Icon';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';
import numeral from 'numeral';

const styles = StyleSheet.create({
	page: {
		backgroundColor: '#ffffff',
		display: 'flex',
		flexDirection: 'column',
		fontSize: '7mm',
		minHeight: '100%',
		padding: '1cm 4cm'
	},
	header: {
		borderBottom: '2px #000 solid',
		alignItems: 'center',
		marginBottom: '5mm'
	},
	report: {
		fontSize: '5mm'
	},
	detail: {
		margin: '10px 0'
	},
	detailTitle: {
		fontSize: '6mm',
		marginBottom: '4mm'
	},
	detailItem: {
		fontSize: '5mm',
		margin: '1mm 10mm',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-end'
	},
	// listItem: {
	// 	alignItems: 'flex-end'
	// },
	// listValue: {
	// 	textAlign: 'right'
	// },
	footer: {
		fontSize: '3mm',
		textAlign: 'right'
	}
});

const SummaryPDF = props => {
	const {
		start,
		end,
		declaredIncome,
		totalIncomings,
		incomePie,
		totalOutgoings,
		deductionsPie,
		businessName
	} = props.data;

	return (
		<Document>
			<Page style={styles.page}>
				{props.data ? (
					<Fragment>
						<View style={styles.header}>
							<Text>
								Summary {moment(start).format('DD/MM/YYYY')} to{' '}
								{moment(end).format('DD/MM/YYYY')}
							</Text>
						</View>
						<View style={styles.report}>
							<View style={styles.detail}>
								<Text style={styles.detailTitle}>
									Receipts {numeral(totalIncomings).format()}
								</Text>
								{incomePie
									.sort((a, b) => (a.value > b.value ? -1 : 1))
									.map(slice => (
										<View key={slice.id} style={styles.detailItem}>
											<Text style={styles.listItem}>
												{slice.label} - {numeral(slice.value).format()}
											</Text>
										</View>
									))}
							</View>
							<View style={styles.detail}>
								<Text style={styles.detailTitle}>
									Deductions {numeral(totalOutgoings).format()}
								</Text>
								{deductionsPie
									.sort((a, b) => (a.value > b.value ? -1 : 1))
									.map(slice => (
										<View key={slice.id} style={styles.detailItem}>
											<Text style={styles.listItem}>
												{slice.label} - {numeral(slice.value).format()}
											</Text>
										</View>
									))}
							</View>
							<View style={styles.detail}>
								<Text style={styles.detailTitle}>
									Income {numeral(declaredIncome).format()}
								</Text>
							</View>
						</View>
						<View style={styles.footer}>
							<Text>printed {moment().format('h:mma Do MMMM YYYY')}</Text>
						</View>
					</Fragment>
				) : null}
			</Page>
		</Document>
	);
};

export default SummaryPDF;
