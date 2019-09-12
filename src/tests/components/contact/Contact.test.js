import React from 'react';
import { shallow } from 'enzyme';
import Contact from '../../../components/contact/Contact';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<Contact />);
});

describe('Contact component', () => {
	it('should render Contact component correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
