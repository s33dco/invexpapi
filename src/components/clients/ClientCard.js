import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import clsx from 'clsx';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { sentanceCase, titleCase } from '../../../config/textFormat';
import {
	setCurrentClient,
	setDeleteClient,
	getClientItems,
} from '../../actions/clientsActions';

const useStyles = makeStyles(theme => ({
	card: {
		minWidth: 275,
		borderRadius: theme.spacing(1),
		boxShadow: theme.shadows[1],
		marginBottom: theme.spacing(1),
	},
	title: {
		textTransform: 'capitalize',
	},
	contact: {
		marginBottom: 0,
		verticalAlign: 'center',
	},
	greeting: {
		marginBottom: theme.spacing(2, 0),
		verticalAlign: 'center',
	},
	buttonArea: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	invoiceLink: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	address: {
		textTransfrom: 'capitalize',
	},
	postCode: {
		textTransfrom: 'uppercase',
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
}));

const ClientCard = ({
	client,
	invoices,
	setCurrentClient,
	setDeleteClient,
	getClientItems,
}) => {
	const {
		name,
		email,
		phone,
		add1,
		add2,
		add3,
		postCode,
		greeting,
	} = client;
	const classes = useStyles();
	const [expanded, setExpanded] = useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};
	return (
		<Card className={classes.card}>
			<CardContent>
				<Typography
					className={classes.title}
					variant="h5"
					component="h2"
				>
					{titleCase(name)}
				</Typography>
				<Typography
					className={classes.contact}
					variant="h6"
					component="h3"
				>
					<PhoneIcon />
					{phone}
				</Typography>
				<Typography
					className={classes.contact}
					variant="h6"
					component="h3"
				>
					<EmailIcon />
					{email}
				</Typography>
			</CardContent>
			<CardActions className={classes.buttonArea}>
				<IconButton
					aria-label="edit client"
					onClick={() => setCurrentClient(client)}
				>
					<EditIcon />
				</IconButton>
				<IconButton
					aria-label="delete client"
					onClick={() => setDeleteClient(client)}
				>
					<DeleteIcon />
				</IconButton>
				<IconButton
					className={clsx(classes.expand, {
						[classes.expandOpen]: expanded,
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
					<Typography
						className={classes.address}
						variant="body1"
						component="p"
						color="textSecondary"
					>
						{titleCase(add1)}
					</Typography>
					{add2 && (
						<Typography
							className={classes.address}
							variant="body1"
							component="p"
							color="textSecondary"
						>
							{titleCase(add2)}
						</Typography>
					)}
					{add3 && (
						<Typography
							className={classes.address}
							variant="body1"
							component="p"
							color="textSecondary"
						>
							{titleCase(add3)}
						</Typography>
					)}
					<Typography
						className={classes.postCode}
						variant="body1"
						component="p"
						color="textSecondary"
					>
						{postCode}
					</Typography>
					<Typography
						className={classes.greeting}
						variant="subtitle1"
						component="p"
					>
						{titleCase(greeting)}
					</Typography>
					<CardActions className={classes.invoiceLink}>
						<Button
							size="small"
							colot="primary"
							onClick={() => getClientItems(client, invoices)}
						>
							previously invoiced items...
						</Button>
					</CardActions>
				</CardContent>
			</Collapse>
		</Card>
	);
};

ClientCard.propTypes = {};

const mapStateToProps = state => ({
	invoices: state.invoices.invoices,
});

export default connect(
	mapStateToProps,
	{ setCurrentClient, setDeleteClient, getClientItems }
)(ClientCard);
