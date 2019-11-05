import React from 'react';
import { shallow } from 'enzyme';
import Footer from '../../../components/layout/Footer';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<Footer />);
});

describe('Footer component', () => {
	it('should render Footer component correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
