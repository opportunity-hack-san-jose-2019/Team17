import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';

import renderer from 'react-test-renderer';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { mount, shallow, render } from 'enzyme';

it('should render correctly', () => {
  const component = mount( <Main></Main>);
  expect(component).toMatchSnapshot();
});
// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<Main />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

