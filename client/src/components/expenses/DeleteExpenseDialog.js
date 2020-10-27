/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
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
import { sentanceCase } from '../../../../config/textFormat';
import {
	deleteExpense,
	clearDeleteExpense,
	clearExpenseErrors,
} from '../../actions/expensesActions';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteExpenseDialog = ({
	deleteExpense,
	clearExpenseErrors,
	clearDeleteExpense,
	toDelete,
}) => {
	const [open, setOpen] = useState(false);
	const [inProcess, setInProcess] = useState(false);
	const [record, setRecord] = useState({ id: '' });
	const [desc, setDesc] = useState('');

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
		await clearDeleteExpense();
		await clearExpenseErrors();
		setInProcess(false);
		setDesc('');
		setRecord({ ...record, id: '' });
		setOpen(false);
		// statusCheck('end of handleClose block');
	};

	const requestDelete = async () => {
		try {
			await deleteExpense(record.id);
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
						This expense, ({sentanceCase(desc)}), will be permanently
						deleted, there is no way back!
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Keep Expense
					</Button>
					{toDelete && (
						<Button onClick={requestDelete} color="primary">
							Delete Expense
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
};

DeleteExpenseDialog.propTypes = {
	deleteExpense: PropTypes.func.isRequired,
	clearExpenseErrors: PropTypes.func.isRequired,
	clearDeleteExpense: PropTypes.func.isRequired,
	// toDelete: PropTypes.shape({
	// 	_id: PropTypes.string.isRequired,
	// 	date: PropTypes.string.isRequired,
	// 	category: PropTypes.string.isRequired,
	// 	amount: PropTypes.string.isRequired,
	// 	desc: PropTypes.string.isRequired,
	// }).isRequired,
};

const mapStateToProps = state => ({
	toDelete: state.expenses.delete,
});

export default connect(mapStateToProps, {
	deleteExpense,
	clearDeleteExpense,
	clearExpenseErrors,
})(DeleteExpenseDialog);
