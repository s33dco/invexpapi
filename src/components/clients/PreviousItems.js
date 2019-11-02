/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-shadow */
import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { titleCase } from '../../../config/textFormat';
import { clearClientItems } from '../../actions/clientsActions';
import ClientItem from './ClientItem';

const useStyles = makeStyles(theme => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		width: '90vw',
		maxHeight: '90vh',
		overflowY: 'auto',
	},
	'@media (min-width: 600px)': {
		paper: {
			width: '50vw',
		},
	},
	textField: {
		marginLeft: '0',
		marginRight: '0',
		width: '100%',
	},
	form: {
		margin: '0',
		width: '100%',
	},
	divider: {
		margin: '1vh 0',
	},
}));

const PreviousItems = ({ clientItems, clearClientItems }) => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [items, setItems] = useState([]);

	const handleClose = () => {
		setOpen(false);
		setItems([]);
		clearClientItems();
	};

	useEffect(() => {
		if (clientItems.name) {
			setItems([...clientItems.items]);
			setOpen(true);
		} else {
			handleClose();
		}
	}, [clientItems.name]);

	return (
		<Fragment>
			<Modal
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
				className={classes.modal}
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<div className={classes.paper}>
						<Container>
							{clientItems.name && (
								<Typography
									variant="subtitle1"
									component="h1"
									align="center"
								>
									{titleCase(clientItems.name)}'s previous items.
								</Typography>
							)}
							{items.length === 0 && (
								<Typography
									variant="subtitle1"
									component="h1"
									align="center"
								>
									No items invoiced so far...
								</Typography>
							)}
							{items.map(item => (
								<ClientItem key={item.id} item={item} />
							))}
						</Container>
					</div>
				</Fade>
			</Modal>
		</Fragment>
	);
};

PreviousItems.propTypes = {
	clientItems: PropTypes.func.isRequired,
	clearClientItems: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	clientItems: state.clients.clientItems,
});

export default connect(
	mapStateToProps,
	{ clearClientItems }
)(PreviousItems);
