import React from 'react';
import { shallow } from 'enzyme';
import Business from '../../../components/pages/Business';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<Business />);
});

describe('Business component', () => {
	it('should render Business component correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
