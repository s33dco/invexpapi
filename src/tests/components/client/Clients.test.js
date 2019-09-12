import React from 'react';
import { shallow } from 'enzyme';
import Clients from '../../../components/clients/Clients';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<Clients />);
});

describe('Clients component', () => {
	it('should render Clients component correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
