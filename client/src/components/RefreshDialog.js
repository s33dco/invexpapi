/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {
	logout,
	refreshToken
} from '../actions/authActions';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const RefreshDialog = ({
	relogin,
	logout,
	refreshToken,
}) => {
	const [open, setOpen] = useState(false);
	const [inProcess, setInProcess] = useState(false);

	useEffect(() => {
		if (relogin) {
			setOpen(true);
			setInProcess(true);
		}
	}, [relogin]);

	const handleClose = async () => {
		setInProcess(false);
		setOpen(false);
	};

	const requestRefresh = async () => {
		try {
			await refreshToken();
			await handleClose();
		} catch (error) {
			console.log(error);
		}
	};

	const requestLogOut = async () => {
		try {
			await logout();
			await handleClose();
		} catch (error) {
			console.log(error);
		}
	};

	const timeToLogOut = (expires) => {
		return expires - (moment().unix())
	}

	return (
		<div>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle id="alert-dialog-slide-title">
					All Done ?
				</DialogTitle>
				<DialogContent>
						<DialogContentText id="alert-dialog-slide-description">
							Your time is nearly up, do you want to...
						</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={requestRefresh} color="primary">
						Continue
					</Button>{" "}or{" "} 

					<Button
						onClick={requestLogOut}
						color="primary"
					>
						log out
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

RefreshDialog.propTypes = {
};

const mapStateToProps = state => ({
	relogin: state.auth.relogin
});

export default connect(
	mapStateToProps,
	{ logout, refreshToken }
)(RefreshDialog);
