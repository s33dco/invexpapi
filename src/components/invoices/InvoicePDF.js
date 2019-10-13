import React, { Fragment } from 'react';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
	Image
} from '@react-pdf/renderer';

import moment from 'moment';

const styles = StyleSheet.create({
	page: {
		backgroundColor: '#ffffff',
		display: 'flex',
		flexDirection: 'column',
		padding: '2cm'
	},
	header: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	addresses: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'flex-start',
		padding: '1cm, 0'
	},
	items: {},
	banking: {
		padding: '1cm, 0'
	},
	footer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		padding: '1cm, 0',
		border: '2mm, solid, black'
	}
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
		total
	} = props.data;
	console.log(business);
	console.log(client);
	return (
		<Document>
			<Page style={styles.page}>
				{props.data ? (
					<Fragment>
						<View style={styles.header}>
							<View>
								<Text style={styles.movieTitle}>Invoice {invNo}</Text>
							</View>
							<View>
								<Text style={styles.movieTitle}>
									{moment(date).format('Do MMMM YYYY')}
								</Text>
								<Text style={styles.movieTitle}>Total Due: £{total}</Text>
							</View>
						</View>

						<View style={styles.addresses}>
							<View>
								<Text style={styles.movieTitle}>{client.name}</Text>
								<Text style={styles.movieTitle}>{client.add1}</Text>
								{client.add2 && (
									<Text style={styles.movieTitle}>{client.add2}</Text>
								)}
								{client.add3 && (
									<Text style={styles.movieTitle}>{client.add3}</Text>
								)}
								<Text style={styles.movieTitle}>{client.postCode}</Text>
							</View>
							<View>
								<Text style={styles.movieTitle}>{business.name}</Text>
								<Text style={styles.movieTitle}>{business.add1}</Text>
								{business.add2 && (
									<Text style={styles.movieTitle}>{business.add2}</Text>
								)}
								{business.add3 && (
									<Text style={styles.movieTitle}>{business.add3}</Text>
								)}
								<Text style={styles.movieTitle}>{business.postCode}</Text>
							</View>
						</View>

						<View style={styles.items}>
							{items.map(item => (
								<View key={item.id}>
									<Text style={styles.movieTitle}>{item.date}</Text>
									<Text style={styles.movieTitle}>{item.desc}</Text>
									<Text style={styles.movieTitle}>{item.fee}</Text>
								</View>
							))}
							<Text style={styles.movieTitle}>Total : {total}</Text>
						</View>

						<View style={styles.withThanks}>
							{paid && (
								<Text style={styles.movieTitle}>
									received with thanks {datePaid}
								</Text>
							)}
						</View>

						<View style={styles.banking}>
							<Text style={styles.movieTitle}>{business.bankName}</Text>

							<Text style={styles.movieTitle}>
								account number : {business.accountNo}
							</Text>
							<Text style={styles.movieTitle}>
								sort code : {business.sortCode}
							</Text>
							<Text style={styles.movieTitle}>UTR : {business.utr}</Text>
							<Text style={styles.movieTitle}>{business.terms}</Text>
						</View>

						<View style={styles.footer}>
							<Text style={styles.movieTitle}>{business.contact}</Text>

							<Text style={styles.movieTitle}>tel : {business.phone}</Text>

							<Text style={styles.movieTitle}>email : {business.email}</Text>
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
