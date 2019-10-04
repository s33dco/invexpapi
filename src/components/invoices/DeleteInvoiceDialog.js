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
import sentanceCase from '../../../config/sentanceCase';
import {
	deleteInvoice,
	clearDeleteInvoice,
	clearInvoiceErrors
} from '../../actions/invoicesActions';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteInvoiceDialog = ({
	deleteInvoice,
	clearInvoiceErrors,
	clearDeleteInvoice,
	toDelete
}) => {
	const [open, setOpen] = useState(false);
	const [inProcess, setInProcess] = useState(false);
	const [record, setRecord] = useState({ id: '' });
	const [desc, setDesc] = useState('');
	const { invNo, paid } = toDelete;

	useEffect(() => {
		if (toDelete && !inProcess) {
			setOpen(true);
			const { _id, desc } = toDelete;
			const objId = _id.toString();
			setRecord({ ...record, id: objId });
			setDesc(desc);
			setInProcess(true);
		}
	}, [toDelete]);

	const handleClose = async () => {
		await clearDeleteInvoice();
		await clearInvoiceErrors();
		setInProcess(false);
		setDesc('');
		setRecord({ ...record, id: '' });
		setOpen(false);
		// statusCheck('end of handleClose block');
	};

	const requestDelete = async () => {
		try {
			await deleteInvoice(record.id);
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
					{'Are you sure?'}
				</DialogTitle>
				<DialogContent>
					{paid ? (
						<DialogContentText id="alert-dialog-slide-description">
							Invoice {invNo} is paid and cannot be deleted! If you really want
							to do this edit the invoice, set paid to false and then delete.
							The information will be permenantly lost.
						</DialogContentText>
					) : (
						<DialogContentText id="alert-dialog-slide-description">
							Invoice {invNo} will be permanently deleted, there is no way back!
						</DialogContentText>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Keep Invoice
					</Button>
					{toDelete && (
						<Button onClick={requestDelete} disabled={paid} color="primary">
							Delete Invoice
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
};

DeleteInvoiceDialog.propTypes = {};

const mapStateToProps = state => ({
	toDelete: state.invoices.delete
});

export default connect(
	mapStateToProps,
	{ deleteInvoice, clearDeleteInvoice, clearInvoiceErrors }
)(DeleteInvoiceDialog);
