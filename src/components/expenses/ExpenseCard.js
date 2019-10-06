import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Moment from 'react-moment';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import numeral from 'numeral';
import 'numeral/locales';
import {
	setCurrentExpense,
	setDeleteExpense
} from '../../actions/expensesActions';
import sentanceCase from '../../../config/sentanceCase';
import titleCase from '../../../config/titleCase';

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
	header: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
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

const ExpenseCard = ({ expense, setCurrentExpense, setDeleteExpense }) => {
	const { date, desc, amount, category } = expense;
	const classes = useStyles();

	return (
		<Card className={classes.card}>
			<CardContent>
				<div className={classes.header}>
					<Typography className={classes.title} variant="h5" component="h2">
						<Moment format="Do MMM YYYY">{date}</Moment>
					</Typography>
					<Typography className={classes.title} variant="h5" component="h2">
						{numeral(amount).format()}
					</Typography>
				</div>
				<Typography className={classes.contact} variant="body1" component="h3">
					{titleCase(category)}
				</Typography>
				<Typography className={classes.contact} variant="body1" component="h3">
					{sentanceCase(desc)}
				</Typography>
			</CardContent>
			<CardActions className={classes.buttonArea}>
				<IconButton
					aria-label="edit expense"
					onClick={() => setCurrentExpense(expense)}
				>
					<EditIcon />
				</IconButton>
				<IconButton
					aria-label="delete expense"
					onClick={() => setDeleteExpense(expense)}
				>
					<DeleteIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
};

export default connect(
	null,
	{ setCurrentExpense, setDeleteExpense }
)(ExpenseCard);
