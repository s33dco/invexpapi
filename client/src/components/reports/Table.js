import React, { useState, Fragment } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fab from '@material-ui/core/Fab';
import Fade from '@material-ui/core/Fade';
import MUIDataTable from 'mui-datatables';
import {
	createMuiTheme,
	MuiThemeProvider,
	makeStyles,
} from '@material-ui/core/styles';
import moment from 'moment';
import PropTypes from 'prop-types';

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
		padding: theme.spacing(0),
		width: '90vw',
		maxHeight: '90vh',
		overflowY: 'auto',
	},

	'@media (min-width: 600px)': {
		paper: {
			width: '95vw',
		},
	},
}));

const Table = ({ tableData, startDate, endDate }) => {
	const getMuiTheme = () =>
		createMuiTheme({
			overrides: {
				MUIDataTableBodyCell: {
					root: {
						maxWidth: '20%',
					},
				},
				MUIDataTableHeadCell: {
					root: {
						maxWidth: '20%',
					},
				},
			},
		});

	const classes = useStyles();
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	// useEffect(() => {}, []); // check for changes from api, api error and change in record being updated

	return (
		<div>
			<Fab
				aria-label="view data"
				className={classes.fab}
				color="primary"
				onClick={handleOpen}
				size="small"
				variant="extended"
				disabled={!(tableData.length > 0)}
			>
				View Data
			</Fab>
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
						<Fragment>
							<MuiThemeProvider theme={getMuiTheme()}>
								<MUIDataTable
									title={`${moment(startDate).format(
										'Do MMM YYYY'
									)} - ${moment(endDate).format('Do MMM YYYY')}`}
									data={tableData}
									columns={[
										{
											name: 'Date',
											options: {
												filter: true,
												sort: false,
											},
										},
										{
											name: 'Details',
											options: {
												filter: true,
												sort: false,
											},
										},
										{
											name: 'Reference',
											options: {
												filter: true,
												sort: false,
											},
										},
										{
											name: '£',
											options: {
												filter: true,
												sort: false,
											},
										},
									]}
									options={{
										filter: true,
										sort: false,
										filterType: 'dropdown',
										responsive: 'scrollMaxHeight',
										selectableRows: 'none',
										pagination: false,
									}}
								/>
							</MuiThemeProvider>
						</Fragment>
					</div>
				</Fade>
			</Modal>
		</div>
	);
};

Table.propTypes = {};

export default Table;
