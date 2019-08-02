import React from 'react';
import Moment from 'react-moment';

const Footer = () => (
	<footer className="footer">
		<p>
			s33d © <Moment format="YYYY">{Date.now()}</Moment>
		</p>
	</footer>
);

export default Footer;
