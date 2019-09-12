import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => (
	<header>
		<nav className="header">
			<NavLink
				className="header__link"
				to="/"
				activeClassName="is-active"
				exact
			>
				Home
			</NavLink>
			<NavLink
				className="header__link"
				to="/invoices"
				activeClassName="is-active"
				exact
			>
				Invoices
			</NavLink>
			<NavLink
				className="header__link"
				to="/clients"
				activeClassName="is-active"
				exact
			>
				Clients
			</NavLink>
			<NavLink
				className="header__link"
				to="/expenses"
				activeClassName="is-active"
				exact
			>
				Expenses
			</NavLink>
			<NavLink
				className="header__link"
				to="/reports"
				activeClassName="is-active"
				exact
			>
				Reports
			</NavLink>
			<NavLink
				className="header__link"
				to="/business"
				activeClassName="is-active"
				exact
			>
				Business
			</NavLink>
			<NavLink
				className="header__link"
				to="/contact"
				activeClassName="is-active"
				exact
			>
				Contact
			</NavLink>
		</nav>
	</header>
);

export default Header;
