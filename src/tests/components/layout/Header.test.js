import React from 'react';
import { shallow } from 'enzyme';
import Header from '../../../components/layout/Header';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<Header />);
});

describe('Header component', () => {
	it('should render Header component correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
