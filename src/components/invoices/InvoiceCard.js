import React, { useState } from 'react';
import { saveAs } from 'file-saver';
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
import EmailIcon from '@material-ui/icons/Email';
import DeleteIcon from '@material-ui/icons/Delete';
import GetApp from '@material-ui/icons/GetApp';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import clsx from 'clsx';
import numeral from 'numeral';
import 'numeral/locales';
import Moment from 'react-moment';
import { pdf, BlobProvider } from '@react-pdf/renderer';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InvoicePDF from './InvoicePDF';
import { sentanceCase, titleCase } from '../../../config/textFormat';
import InvoiceJobItem from './InvoiceJobItem';
import {
	setCurrentInvoice,
	setDeleteInvoice,
	payInvoice,
	unpayInvoice,
	emailInvoice
} from '../../actions/invoicesActions';

numeral.locale('en-gb');
numeral.defaultFormat('$0,0.00');

const useStyles = makeStyles(theme => ({
	card: {
		minWidth: 275,
		borderRadius: theme.spacing(1),
		boxShadow: theme.shadows[1],
		marginBottom: theme.spacing(1)
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
	buttonArea: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	expandOpen: {
		transform: 'rotate(180deg)'
	}
}));

const InvoiceCard = ({
	invoice,
	setCurrentInvoice,
	setDeleteInvoice,
	payInvoice,
	unpayInvoice,
	emailInvoice
}) => {
	const {
		invNo,
		date,
		client,
		total,
		paid,
		items,
		emailSent,
		datePaid,
		greeting,
		message,
		_id
	} = invoice;
	const { name } = client;
	const classes = useStyles();
	const [expanded, setExpanded] = useState(false);
	const [file, setFile] = useState(null);
	const fileName = `Invoice${invNo}.pdf`;

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const sendInvoiceToEmail = async invoice => {
		const info = {
			to: invoice.client.email,
			greeting: invoice.client.greeting,
			clientName: invoice.client.name,
			businessName: invoice.business.name,
			from: invoice.business.email,
			contact: invoice.business.contact,
			message: invoice.message,
			farewell: invoice.business.farewell,
			invNo: invoice.invNo,
			total: invoice.total,
			fileName: fileName,
			paid: paid,
			_id: _id
		};
		const blob = await pdf(<InvoicePDF data={invoice} />).toBlob();
		emailInvoice(info, blob);
	};

	const downloadInvoice = async invoice => {
		const doc = await pdf(<InvoicePDF data={invoice} />).toBlob();
		saveAs(doc, `${fileName}`);
	};

	return (
		<Card className={classes.card}>
			<CardContent>
				<div className={classes.buttonArea}>
					<Typography className={classes.title} variant="h6" component="h2">
						Invoice {invNo}
					</Typography>
					<Typography className={classes.contact} variant="h6" component="h2">
						{numeral(total).format()}
					</Typography>
				</div>
				<Typography className={classes.contact} variant="h6" component="h3">
					{titleCase(name)}
				</Typography>
				<Typography className={classes.contact} variant="body1" component="h3">
					Invoice Date <Moment format="Do MMM YYYY">{date}</Moment>
				</Typography>
				{emailSent ? (
					<Typography
						className={classes.contact}
						variant="body1"
						component="h3"
					>
						Emailed <Moment format="Do MMM YYYY">{emailSent}</Moment>
					</Typography>
				) : (
					<Typography
						className={classes.contact}
						variant="body1"
						component="h3"
					>
						(not emailed)
					</Typography>
				)}
				{paid ? (
					<Typography
						className={classes.contact}
						variant="body1"
						component="h3"
					>
						Payment received <Moment format="Do MMM YYYY">{datePaid}</Moment>
					</Typography>
				) : (
					<Typography
						className={classes.contact}
						variant="body1"
						component="h3"
					>
						Due <Moment fromNow>{date}</Moment>
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
					aria-label="email invoice"
					onClick={() => sendInvoiceToEmail(invoice)}
				>
					<EmailIcon />
				</IconButton>
				<IconButton
					aria-label="download invoice"
					onClick={() => downloadInvoice(invoice)}
				>
					<GetApp color="action" />
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
				{!paid ? (
					<CardActions
						className={classes.invoiceLink}
						onClick={() => payInvoice(_id)}
					>
						<Button size="small" colot="primary">
							mark as paid
						</Button>
					</CardActions>
				) : (
					<CardActions
						className={classes.invoiceLink}
						onClick={() => unpayInvoice(_id)}
					>
						<Button size="small" colot="primary">
							mark as unpaid
						</Button>
					</CardActions>
				)}
			</Collapse>
		</Card>
	);
};

export default connect(
	null,
	{
		setCurrentInvoice,
		setDeleteInvoice,
		payInvoice,
		unpayInvoice,
		emailInvoice
	}
)(InvoiceCard);
