import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import numeral from 'numeral';
import 'numeral/locales';
import Moment from 'react-moment';
import Typography from '@material-ui/core/Typography';
import { sentanceCase } from '../../../config/textFormat';
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
	item: {},
	address: {
		textTransfrom: 'capitalize'
	},
	buttonArea: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
}));

const InvoiceJobItem = ({ item }) => {
	const { desc, date, fee } = item;
	const classes = useStyles();

	return (
		<CardContent className={classes.item}>
			<Container>
				<div className={classes.buttonArea}>
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
						{numeral(fee).format()}
					</Typography>
				</div>
				<Typography
					className={classes.address}
					variant="subtitle1"
					component="p"
					color="textSecondary"
				>
					{sentanceCase(desc)}
				</Typography>
			</Container>
		</CardContent>
	);
};

export default InvoiceJobItem;
