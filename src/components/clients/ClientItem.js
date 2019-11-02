import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import numeral from 'numeral';
import Moment from 'react-moment';
import { sentanceCase } from '../../../config/textFormat';
import 'numeral/locales';

numeral.locale('en-gb');
numeral.defaultFormat('$0,0.00');

const useStyles = makeStyles(theme => ({
	wrapper: {
		margin: theme.spacing(2, 0),
		padding: theme.spacing(1),
	},
	buttonArea: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
}));

const ClientItem = ({ item }) => {
	const classes = useStyles();

	return (
		<Container className={classes.wrapper}>
			<div className={classes.buttonArea}>
				<Typography variant="body1" component="h2">
					<Moment format="Do MMM YYYY">{item.date}</Moment>
				</Typography>
				<Typography variant="body1" component="h2">
					{numeral(item.fee).format()}
				</Typography>
			</div>
			<Typography />
			{sentanceCase(item.desc)}
		</Container>
	);
};

ClientItem.propTypes = {
	item: PropTypes.shape({
		date: PropTypes.string.isRequired,
		fee: PropTypes.string.isRequired,
		desc: PropTypes.string.isRequired,
	}).isRequired,
};

export default ClientItem;
