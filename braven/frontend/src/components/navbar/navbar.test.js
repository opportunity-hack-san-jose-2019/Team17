// Link.react.test.js
import React from 'react';
import Navbar from './navbar';
import renderer from 'react-test-renderer';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { mount, shallow, render } from 'enzyme';

it('should render correctly', () => {
  const component = shallow( <Navbar></Navbar>);
  expect(component).toMatchSnapshot();
});

