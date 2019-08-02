import React from 'react';
import { shallow } from 'enzyme';
import NoMatch from '../../../components/pages/NoMatch';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<NoMatch />);
});

describe('NoMatch component', () => {
	it('should render NoMatch component correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
