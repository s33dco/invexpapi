import React, { Fragment } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
} from '@react-pdf/renderer';
import moment from 'moment';
import { sentanceCase, titleCase } from '../../../config/textFormat';

const styles = StyleSheet.create({
	page: {
		backgroundColor: '#ffffff',
		display: 'flex',
		flexDirection: 'column',
		fontSize: '5mm',
		minHeight: '100%',
		padding: '2cm',
	},
	header: {
		display: 'flex',
		borderBottom: '2px #000 solid',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: '5mm',
	},
	number: {
		fontSize: '10mm',
	},
	dateTotal: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
	},
	sideBySide: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	addresses: {
		display: 'flex',
		flexDirection: 'row',
		fontSize: '4mm',
		justifyContent: 'space-around',
		alignItems: 'flex-start',
		padding: '7.5mm, 0',
	},
	items: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: '1',
		justifyContent: 'space-around',
	},
	invoiceItem: {
		padding: '5mm, 0, 0',
		display: 'flex',
		flexDirection: 'row',
		fontSize: '4mm',
	},
	details: {
		width: '85%',
	},
	money: {
		width: '15%',
	},
	aRight: {
		fontSize: '4mm',
		textAlign: 'right',
	},
	cCenter: {
		textAlign: 'center',
	},
	banking: {
		display: 'flex',
		flexDirection: 'column',
	},
	payment: {
		fontSize: '4mm',
	},

	withThanks: {
		fontSize: '7mm',
		padding: '5mm, 0',
		textAlign: 'center',
	},
	footer: {
		borderTop: '2px #000 solid',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		padding: '1cm, 0',
		border: '2mm, solid, black',
	},
});

const InvoicePDF = props => {
	const {
		client,
		business,
		date,
		invNo,
		items,
		paid,
		datePaid,
		total,
	} = props.data;

	return (
		<Document>
			<Page style={styles.page}>
				{props.data ? (
					<Fragment>
						<View style={styles.header}>
							<View>
								<Text style={styles.number}>Invoice {invNo}</Text>
							</View>
							<View style={styles.dateTotal}>
								<View style={styles.sideBySide}>
									<Text>Total Due £{total}</Text>
								</View>
								<View style={styles.sideBySide}>
									<Text>{moment(date).format('Do MMMM YYYY')}</Text>
								</View>
							</View>
						</View>

						<View style={styles.addresses}>
							<View>
								<Text>{titleCase(client.name)}</Text>
								<Text>{titleCase(client.add1)}</Text>
								{client.add2 && (
									<Text style={styles.movieTitle}>
										{titleCase(client.add2)}
									</Text>
								)}
								{client.add3 && <Text>{titleCase(client.add3)}</Text>}
								<Text>{client.postCode}</Text>
							</View>
							<View>
								<Text>{titleCase(business.name)}</Text>
								<Text>{titleCase(business.add1)}</Text>
								{business.add2 && (
									<Text>{titleCase(business.add2)}</Text>
								)}
								{business.add3 && (
									<Text>{titleCase(business.add3)}</Text>
								)}
								<Text>{business.postCode}</Text>
							</View>
						</View>

						<View style={styles.items}>
							{items.map(item => (
								<View key={item.id} style={styles.invoiceItem}>
									<View style={styles.details}>
										<Text>
											{moment(item.date).format('dddd Do MMMM YYYY')}
										</Text>
										<Text>{sentanceCase(item.desc)}</Text>
									</View>

									<View style={styles.money}>
										<Text style={styles.aRight}>£{item.fee}</Text>
									</View>
								</View>
							))}
							<Text style={styles.aRight}>Total : £{total}</Text>
						</View>

						<View style={styles.withThanks}>
							{paid && (
								<Text style={styles.movieTitle}>
									Received with thanks{' '}
									{moment(datePaid).format('Do MMMM YYYY')}
								</Text>
							)}
						</View>

						<View style={styles.banking}>
							<View style={styles.payment}>
								<Text style={styles.cCenter}>Payment Details.</Text>
								<Text style={styles.cCenter}>
									{titleCase(business.bankName)}, account{' '}
									{business.accountNo}, sortcode : {business.sortCode}
								</Text>
								<Text style={styles.cCenter}>
									UTR : {business.utr}
								</Text>
							</View>
							<View style={styles.payment}>
								<Text style={styles.cCenter}>
									{sentanceCase(business.terms)}
								</Text>
							</View>
						</View>

						<View style={styles.footer}>
							<Text>
								{titleCase(business.contact)} {business.phone}{' '}
								{business.email}
							</Text>
						</View>
					</Fragment>
				) : (
					''
				)}
			</Page>
		</Document>
	);
};

export default InvoicePDF;
