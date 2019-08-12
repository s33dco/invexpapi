import React from 'react';
import { shallow } from 'enzyme';
import Invoices from '../../../components/pages/Invoices';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<Invoices />);
});

describe('Invoices component', () => {
	it('should render Invoices component correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
