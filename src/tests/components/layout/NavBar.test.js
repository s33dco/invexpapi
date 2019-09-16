import React from 'react';
import { shallow } from 'enzyme';
import NavBar from '../../../components/layout/NavBar';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<NavBar />);
});

describe('NavBar component', () => {
	it('should render NavBar component correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
