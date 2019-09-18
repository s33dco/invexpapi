import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { logout } from '../../actions/authActions';

const NavBar = ({ isAuthenticated, user, logout }) => {
	return (
		<AppBar position="static">
			<Toolbar>
				<Typography variant="headline" component="p" align="right">
					Some Text
				</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default NavBar;
// original feature
// const NavBar = ({ isAuthenticated, user, logout }) => {
// 	const authLinks = (
// 		<Fragment>
// 			<li>
// 				<NavLink
// 					className="header__link"
// 					to="/"
// 					activeClassName="is-active"
// 					exact
// 				>
// 					Dashboard
// 				</NavLink>
// 			</li>
// 			<li>
// 				<NavLink
// 					className="header__link"
// 					to="/invoices"
// 					activeClassName="is-active"
// 					exact
// 				>
// 					Invoices
// 				</NavLink>
// 			</li>
// 			<li>
// 				<NavLink
// 					className="header__link"
// 					to="/clients"
// 					activeClassName="is-active"
// 					exact
// 				>
// 					Clients
// 				</NavLink>
// 			</li>
// 			<li>
// 				<NavLink
// 					className="header__link"
// 					to="/expenses"
// 					activeClassName="is-active"
// 					exact
// 				>
// 					Expenses
// 				</NavLink>
// 			</li>
// 			<li>
// 				<NavLink
// 					className="header__link"
// 					to="/reports"
// 					activeClassName="is-active"
// 					exact
// 				>
// 					Reports
// 				</NavLink>
// 			</li>
// 			<li>
// 				<NavLink
// 					className="header__link"
// 					to="/business"
// 					activeClassName="is-active"
// 					exact
// 				>
// 					Invoice Info
// 				</NavLink>
// 			</li>
// 			<li>
// 				<a className="header__link" onClick={logout}>
// 					Log out
// 				</a>
// 			</li>
// 		</Fragment>
// 	);
// 	const publicLinks = (
// 		<Fragment>
// 			<li>
// 				<NavLink
// 					className="header__link"
// 					to="/"
// 					activeClassName="is-active"
// 					exact
// 				>
// 					About
// 				</NavLink>
// 			</li>
// 			{isAuthenticated && { authLinks }}

// 			<li>
// 				<NavLink
// 					className="header__link"
// 					to="/contact"
// 					activeClassName="is-active"
// 					exact
// 				>
// 					Contact
// 				</NavLink>
// 			</li>
// 		</Fragment>
// 	);
// 	return (
// 		<nav>
// 			<div className="nav-wrapper">
// 				<ul className="right">{isAuthenticated ? authLinks : publicLinks}</ul>
// 			</div>
// 		</nav>
// 	);
// };

// NavBar.propTypes = {
// 	isAuthenticated: PropTypes.bool.isRequired
// };

// const mapStateToProps = state => ({
// 	isAuthenticated: state.auth.isAuthenticated,
// 	user: state.auth.user
// });

// export default connect(
// 	mapStateToProps,
// 	{ logout }
// )(NavBar);
