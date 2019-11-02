// Link.react.test.js
import React from 'react';
import Profile from './profile';
import renderer from 'react-test-renderer';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { mount, shallow, render } from 'enzyme';

it('should render correctly', () => {
  const component = shallow( <Profile></Profile>);
  expect(component).toMatchSnapshot();
});

// it('changes the class when hovered', () => {
//     const component = renderer.create(
//       <Link page="http://www.facebook.com">Facebook</Link>
//     );
    
//     let tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
    
//     // manually trigger the callback
//     tree.props.onMouseEnter();
//      // re-rendering
//     tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
    
//   });
