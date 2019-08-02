import React from 'react';
import { shallow } from 'enzyme';
import Home from '../../../components/pages/Dashboard';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<Home />);
});

describe('Dashboard', () => {
	it('should render Dashboard correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
