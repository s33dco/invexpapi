import React from 'react';
import { shallow } from 'enzyme';
import About from '../../../components/pages/About';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<About />);
});

describe('About component', () => {
	it('should render About component correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
