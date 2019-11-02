import loginReducer from "./loginReducer";
import homeReducer from "./homeReducer";

import profileReducer from "./profileReducer";
import signupReducer from "./signupReducer";
import navbarReducer from "./navbarReducer";

import { combineReducers } from "redux";
import { LOGOUT_USER } from "../actions/loginActions";
const rootReducers = combineReducers({
  login: loginReducer,
  signup: signupReducer,
  profile: profileReducer,
  home: homeReducer,
  navbar: navbarReducer
});

const allReducers = (state, action) => {
  if (action.type === LOGOUT_USER) {
    state = undefined;
  }

  return rootReducers(state, action);
};

export default allReducers;
