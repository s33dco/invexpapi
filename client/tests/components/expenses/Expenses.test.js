import React from 'react';
import { shallow } from 'enzyme';
import Expenses from '../../../components/expenses/Expenses';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<Expenses />);
});

describe('Expenses component', () => {
	it('should render Expenses component correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
