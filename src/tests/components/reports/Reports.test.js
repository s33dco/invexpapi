import React from 'react';
import { shallow } from 'enzyme';
import Reports from '../../../components/reports/Reports';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<Reports />);
});

describe('Reports component', () => {
	it('should render Reports component correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
