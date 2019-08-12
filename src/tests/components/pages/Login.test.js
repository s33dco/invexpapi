import React from 'react';
import { shallow } from 'enzyme';
import Login from '../../../components/pages/Login';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<Login />);
});

describe('Login component', () => {
	it('should render Login component correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
