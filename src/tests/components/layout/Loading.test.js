import React from 'react';
import { shallow } from 'enzyme';
import Loading from '../../../components/layout/Loading';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<Loading />);
});

describe('Loading component', () => {
	it('should render Loading component correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
