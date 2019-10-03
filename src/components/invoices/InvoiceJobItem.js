import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import numeral from 'numeral';
import 'numeral/locales';
import Moment from 'react-moment';
import Typography from '@material-ui/core/Typography';
import sentanceCase from '../../../config/sentanceCase';
import titleCase from '../../../config/titleCase';
import {
	setCurrentInvoice,
	setDeleteInvoice
} from '../../actions/invoicesActions';

numeral.locale('en-gb');
numeral.defaultFormat('$0,0.00');

const useStyles = makeStyles(theme => ({
	card: {
		minWidth: 275
	},
	address: {
		textTransfrom: 'capitalize'
	}
}));

const InvoiceJobItem = ({ item }) => {
	const { desc, date, fee } = item;
	const classes = useStyles();

	return (
		<CardContent>
			<Container>
				<Typography
					className={classes.address}
					variant="subtitle1"
					component="p"
					color="textSecondary"
				>
					<Moment format="Do MMM YYYY">{date}</Moment>
				</Typography>
				<Typography
					className={classes.address}
					variant="subtitle1"
					component="p"
					color="textSecondary"
				>
					{sentanceCase(desc)}
				</Typography>
				<Typography
					className={classes.address}
					variant="subtitle1"
					component="p"
					color="textSecondary"
				>
					{numeral(fee).format()}
				</Typography>
			</Container>
		</CardContent>
	);
};

export default InvoiceJobItem;
