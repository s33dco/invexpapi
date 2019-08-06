import React from 'react';
import { shallow } from 'enzyme';
import Dashboard from '../../../components/pages/Dashboard';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<Dashboard />);
});

describe('Dashboard', () => {
	it('should render Dashboard correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
