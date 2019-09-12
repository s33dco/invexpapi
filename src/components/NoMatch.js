import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const NoMatch = () => {
	return (
		<Fragment>
			<p>This is not a page</p>
			<p>
				<Link to="/">go home</Link>
			</p>
		</Fragment>
	);
};

export default NoMatch;
