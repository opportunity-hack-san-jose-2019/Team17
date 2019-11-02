import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Main from "./Main";
import registerServiceWorker from "./registerServiceWorker";
import thunk from "redux-thunk";
import { applyMiddleware, compose, combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import allReducers from "./reducers/allReducers";

const allStoreEnchancers = compose(
  applyMiddleware(thunk)
  //  , window.devToolsExtension && window.devToolsExtension()
);
const store = createStore(allReducers, allStoreEnchancers);
ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
