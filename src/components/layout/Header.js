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
				Dashboard
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
