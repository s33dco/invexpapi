import React from 'react';
import Moment from 'react-moment';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const Footer = () => (
	<div>
		<Typography color="textSecondary" align="right">
			<Link href="https://www.s33d.co" color="textSecondary">
				s33d
			</Link>{' '}
			© <Moment format="YYYY">{Date.now()}</Moment>
		</Typography>
	</div>
);

export default Footer;
