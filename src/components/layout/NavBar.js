/* eslint-disable react/require-default-props */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { logout } from '../../actions/authActions';

const drawerWidth = 128;
const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
	},
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: drawerWidth,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	closeMenuButton: {
		marginRight: 'auto',
		marginLeft: 0,
	},
	title: {
		flexGrow: 1,
	},
}));
const NavBar = ({ isAuthenticated, user, logout }) => {
	const authLinks = [
		<NavLink
			className="header__link"
			to="/"
			activeClassName="is-active"
			exact
		>
			<Typography>Dashboard</Typography>
		</NavLink>,
		<NavLink
			className="header__link"
			to="/invoices"
			activeClassName="is-active"
			exact
		>
			<Typography>Invoices</Typography>
		</NavLink>,
		<NavLink
			className="header__link"
			to="/clients"
			activeClassName="is-active"
			exact
		>
			<Typography>Clients</Typography>
		</NavLink>,
		<NavLink
			className="header__link"
			to="/expenses"
			activeClassName="is-active"
			exact
		>
			<Typography>Expenses</Typography>
		</NavLink>,
		<NavLink
			className="header__link"
			to="/reports"
			activeClassName="is-active"
			exact
		>
			<Typography>Reports</Typography>
		</NavLink>,
		<NavLink
			className="header__link"
			to="/business"
			activeClassName="is-active"
			exact
		>
			<Typography>Invoice Info</Typography>
		</NavLink>,
	];
	const publicLinks = [
		<NavLink
			className="header__link"
			to="/"
			activeClassName="is-active"
			exact
		>
			<Typography>About</Typography>
		</NavLink>,
		<NavLink
			className="header__link"
			to="/contact"
			activeClassName="is-active"
			exact
		>
			<Typography>Get In Touch</Typography>
		</NavLink>,
	];

	const classes = useStyles();
	const theme = useTheme();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	function handleDrawerToggle() {
		setMobileOpen(!mobileOpen);
	}
	const drawer = (
		<div>
			{isAuthenticated && user ? (
				<List>
					{authLinks.map((link, index) => (
						<ListItem button key={index}>
							{link}
						</ListItem>
					))}
				</List>
			) : (
				<List>
					{publicLinks.map((link, index) => (
						<ListItem button key={index}>
							{link}
						</ListItem>
					))}
				</List>
			)}
		</div>
	);
	return (
		<div className={classes.root}>
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="Open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						className={classes.menuButton}
					>
						<MenuIcon />
					</IconButton>
					{isAuthenticated && user && (
						<Fragment>
							<Typography
								// variant=""
								component="p"
								align="center"
								nowrap="true"
								className={classes.title}
							>
								{user.name}
							</Typography>
							<Button color="inherit" onClick={logout}>
								Log Out
							</Button>
						</Fragment>
					)}
				</Toolbar>
			</AppBar>

			<nav className={classes.drawer}>
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Hidden smUp implementation="css">
					<Drawer
						variant="temporary"
						anchor={theme.direction === 'rtl' ? 'right' : 'left'}
						open={mobileOpen}
						onClose={handleDrawerToggle}
						classes={{
							paper: classes.drawerPaper,
						}}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}
					>
						<IconButton
							onClick={handleDrawerToggle}
							className={classes.closeMenuButton}
						>
							<CloseIcon />
						</IconButton>
						{drawer}
					</Drawer>
				</Hidden>
				<Hidden xsDown implementation="css">
					<Drawer
						className={classes.drawer}
						variant="permanent"
						classes={{
							paper: classes.drawerPaper,
						}}
					>
						<div className={classes.toolbar} />

						{drawer}
					</Drawer>
				</Hidden>
			</nav>
			<div className={classes.content}>
				<div className={classes.toolbar} />
			</div>
		</div>
	);
};

NavBar.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	logout: PropTypes.func.isRequired,
	user: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string,
	}),
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user,
});

export default connect(
	mapStateToProps,
	{ logout }
)(NavBar);
