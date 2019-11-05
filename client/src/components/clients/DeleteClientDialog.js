/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { titleCase } from '../../../../config/textFormat';
import {
	deleteClient,
	clearDeleteClient,
	clearClientErrors,
} from '../../actions/clientsActions';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteClientDialog = ({
	deleteClient,
	clearClientErrors,
	clearDeleteClient,
	toDelete,
}) => {
	const [open, setOpen] = useState(false);
	const [inProcess, setInProcess] = useState(false);
	const [record, setRecord] = useState({ id: '' });
	const [name, setName] = useState('');

	useEffect(() => {
		if (toDelete && !inProcess) {
			setOpen(true);
			const { _id, name } = toDelete;
			const objId = _id.toString();
			setRecord({ ...record, id: objId });
			setName(name);
			setInProcess(true);
		}
	}, [toDelete]);

	const handleClose = async () => {
		await clearDeleteClient();
		await clearClientErrors();
		setInProcess(false);
		setName('');
		setRecord({ ...record, id: '' });
		setOpen(false);
		// statusCheck('end of handleClose block');
	};

	const requestDelete = async () => {
		try {
			const res = await deleteClient(record.id);
			console.log(res);
			await handleClose();
		} catch (error) {
			console.log(error);
		}
	};

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
					Are you sure?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						{titleCase(name)} will be permanently deleted, there is no
						way back!
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Keep Client
					</Button>
					{toDelete && (
						<Button onClick={requestDelete} color="primary">
							Delete Client
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
};

DeleteClientDialog.propTypes = {
	deleteClient: PropTypes.func.isRequired,
	clearClientErrors: PropTypes.func.isRequired,
	clearDeleteClient: PropTypes.func.isRequired,
	toDelete: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		phone: PropTypes.string.isRequired,
		add1: PropTypes.string.isRequired,
		add2: PropTypes.string,
		add3: PropTypes.string,
		postCode: PropTypes.string.isRequired,
		greeting: PropTypes.string.isRequired,
	}).isRequired,
};

const mapStateToProps = state => ({
	toDelete: state.clients.delete,
});

export default connect(
	mapStateToProps,
	{ deleteClient, clearDeleteClient, clearClientErrors }
)(DeleteClientDialog);
