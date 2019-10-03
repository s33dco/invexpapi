import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EmailIcon from '@material-ui/icons/Email';
import PrintIcon from '@material-ui/icons/Print';
import clsx from 'clsx';
import numeral from 'numeral';
import 'numeral/locales';
import Moment from 'react-moment';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import sentanceCase from '../../../config/sentanceCase';
import titleCase from '../../../config/titleCase';
import InvoiceJobItem from './InvoiceJobItem';
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
	title: {
		textTransform: 'capitalize'
	},
	contact: {
		marginBottom: 0,
		verticalAlign: 'center'
	},
	buttonArea: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	invoiceLink: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	address: {
		textTransfrom: 'capitalize'
	},
	postCode: {
		textTransfrom: 'uppercase'
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: 'rotate(180deg)'
	}
}));

const InvoiceCard = ({ invoice, setCurrentInvoice, setDeleteInvoice }) => {
	const {
		invNo,
		date,
		client,
		total,
		paid,
		items,
		emailSent,
		datePaid
	} = invoice;
	const { name, email } = client;
	const classes = useStyles();
	const [expanded, setExpanded] = useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};
	return (
		<Card className={classes.card}>
			<CardContent>
				<Typography className={classes.title} variant="h5" component="h2">
					Invoice {invNo}
				</Typography>
				<Typography className={classes.contact} variant="h6" component="h3">
					{titleCase(name)}
				</Typography>
				<Typography className={classes.contact} variant="h6" component="h3">
					{email}
				</Typography>
				{/* <Typography className={classes.contact} variant="h6" component="h3">
					{numeral(total).format()}
				</Typography> */}

				{paid ? (
					<Typography className={classes.contact} variant="h6" component="h3">
						paid on <Moment format="Do MMM YYYY">{date}</Moment>
					</Typography>
				) : (
					<Typography className={classes.contact} variant="h6" component="h3">
						due for <Moment fromNow>{date}</Moment>
					</Typography>
				)}
				{emailSent ? (
					<Typography className={classes.contact} variant="h6" component="h3">
						last emailed on <Moment format="Do MMM YYYY">{emailSent}</Moment>
					</Typography>
				) : (
					<Typography className={classes.contact} variant="h6" component="h3">
						you have not emailed this invoice
					</Typography>
				)}
			</CardContent>
			<CardActions className={classes.buttonArea}>
				<IconButton
					aria-label="edit invoice"
					onClick={() => setCurrentInvoice(invoice)}
				>
					<EditIcon />
				</IconButton>
				<IconButton
					aria-label="print invoice"
					// onClick={() => setDeleteInvoice(invoice)}
				>
					<PrintIcon />
				</IconButton>
				<IconButton
					aria-label="delete invoice"
					onClick={() => setDeleteInvoice(invoice)}
				>
					<DeleteIcon />
				</IconButton>
				<IconButton
					className={clsx(classes.expand, {
						[classes.expandOpen]: expanded
					})}
					onClick={handleExpandClick}
					aria-expanded={expanded}
					aria-label="show more"
				>
					<ExpandMoreIcon />
				</IconButton>
			</CardActions>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>
					{items.map(item => (
						<InvoiceJobItem key={item.id} item={item} />
					))}
				</CardContent>
			</Collapse>
		</Card>
	);
};

export default connect(
	null,
	{ setCurrentInvoice, setDeleteInvoice }
)(InvoiceCard);
