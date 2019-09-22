import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import { updateBusiness } from '../../actions/businessActions';
import sentanceCase from '../../../config/sentanceCase';
import EditBusiness from './EditBusiness';
import AddBusiness from './AddBusiness';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		marginBottom: '2.5vh'
	},
	title: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightRegular,
		marginBottom: '2vh',
		textTransform: 'capitalize'
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular
	},
	info: {
		display: 'block',
		fontSize: theme.typography.pxToRem(10),
		fontWeight: theme.typography.fontWeightRegular
	},
	text: {
		textTransform: 'capitalize'
	}
}));

const Business = ({
	business: {
		name,
		email,
		phone,
		add1,
		add2,
		add3,
		postCode,
		bankName,
		accountNo,
		sortCode,
		utr,
		terms,
		farewell,
		contact
	},
	updateBusiness
}) => {
	const classes = useStyles();

	if (name) {
		return (
			<Fragment>
				<Typography
					className={classes.title}
					variant="h4"
					component="h1"
					align="center"
				>
					{name} Details
				</Typography>
				<div className={classes.root}>
					<ExpansionPanel>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography className={classes.heading}>
								Invoice Contact Information
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<List>
								<ListItem>
									<ListItemIcon>
										<BusinessCenterIcon />
									</ListItemIcon>
									<ListItemText className={classes.text}>{name}</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<EmailIcon />
									</ListItemIcon>
									<ListItemText>{email}</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<PhoneIcon />
									</ListItemIcon>
									<ListItemText>{phone}</ListItemText>
								</ListItem>
							</List>
						</ExpansionPanelDetails>
					</ExpansionPanel>
					<ExpansionPanel>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel2a-content"
							id="panel2a-header"
						>
							<Typography className={classes.heading}>
								Invoice Address
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<List>
								<ListItem>
									<ListItemText className={classes.text}>{add1}</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText className={classes.text}>{add2}</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText className={classes.text}>{add3}</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText>{postCode}</ListItemText>
								</ListItem>
							</List>
						</ExpansionPanelDetails>
					</ExpansionPanel>
					<ExpansionPanel>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel3a-content"
							id="panel3a-header"
						>
							<Typography className={classes.heading}>
								Email Signature
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<List>
								<ListItem>
									<ListItemText className={classes.text}>
										{farewell}
									</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText className={classes.text}>
										{contact}
									</ListItemText>
								</ListItem>
							</List>
						</ExpansionPanelDetails>
					</ExpansionPanel>
					<ExpansionPanel>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel4a-content"
							id="panel4a-header"
						>
							<Typography className={classes.heading}>
								Banking Details
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<List>
								<ListItem>
									<ListItemText className={classes.text}>
										{bankName}
									</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText>account number : {accountNo}</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemText>sort code : {sortCode}</ListItemText>
								</ListItem>
							</List>
						</ExpansionPanelDetails>
					</ExpansionPanel>
					<ExpansionPanel>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel5a-content"
							id="panel5a-header"
						>
							<Typography className={classes.heading}>Invoice Terms</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<List>
								<ListItem>
									<ListItemText>{sentanceCase(terms)}</ListItemText>
								</ListItem>
							</List>
						</ExpansionPanelDetails>
					</ExpansionPanel>
					<ExpansionPanel>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel6a-content"
							id="panel6a-header"
						>
							<Typography className={classes.heading}>Tax Reference</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<List>
								<ListItem>
									<ListItemText>{utr}</ListItemText>
								</ListItem>
							</List>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</div>
				<EditBusiness />
			</Fragment>
		);
	}
	return <AddBusiness />;
};

Business.propTypes = {};

const mapStateToProps = state => ({
	business: state.business.business
});

export default connect(
	mapStateToProps,
	{ updateBusiness }
)(Business);
