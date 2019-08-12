import React from 'react';
import { shallow } from 'enzyme';
import Register from '../../../components/pages/Register';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<Register />);
});

describe('Register component', () => {
	it('should render Register component correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
