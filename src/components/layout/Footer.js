import React from 'react';
import Moment from 'react-moment';

const Footer = () => (
	<footer className="page-footer">
		<div className="footer-copyright">
			<div className="container">
				<span className="center">
					<Moment format="YYYY">{Date.now()}</Moment> © <a href="#!">s33d</a>
				</span>
			</div>
		</div>
	</footer>
);

export default Footer;
