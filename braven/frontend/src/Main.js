import React, { Component, Fragment } from "react";
import "./App.css";
// import axios from "axios";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Home from "./components/home/home";
import Navbar from "./components/navbar/navbar";
import AppRoute from "./AppRoute";

import Profile from "./components/profile/profile";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import cookie from "react-cookies";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authFlag: false
    };
    this.authenticated = this.authenticated.bind(this);
  }

  authenticated() {
    this.setState({ authFlag: true });
  }
  render() {
    let routesVar = null;
    if (cookie.load("cookie")) {
      let { role } = cookie.load("cookie");

      if (role === "student") {
        routesVar = (
          <Fragment>
            {/* <AppRoute path="/courses/:courseid"  layout={Navbar} component={Insidebar}/> */}
            <AppRoute
              exact
              path="/course/searchcourse"
              layout={Navbar}
              component={Home}
            />
          </Fragment>
        );
      } else {
        routesVar = (
          <Fragment>
            {/* <AppRoute path="/courses/:courseid"  layout={Navbar} component={InsidebarFaculty}/> */}
            <AppRoute
              exact
              path="/course/createcourse"
              layout={Navbar}
              component={Home}
            />
          </Fragment>
        );
      }
    }
    return (
      <Router>
        <div>
          <Switch>
            {/* <AppRoute exact path="/" auth={this.authenticated} component={Login}/> */}
            <AppRoute
              path="/login"
              auth={this.authenticated}
              component={Login}
            />
            <AppRoute path="/signup" component={Signup} />
            <AppRoute exact path="/" layout={Navbar} component={Home} />
            <AppRoute path="/profile" layout={Navbar} component={Profile} />
            {/* <AppRoute path="/inbox" layout={Navbar} component={Inbox}/> */}
            {routesVar}
            <AppRoute layout={Navbar} component={Login}></AppRoute>
          </Switch>
        </div>
      </Router>
    );
  }
}
const mapStatetoProps = (state, props) => {
  return {
    ...state,
    ...props
  };
};
const mapActionToProps = (dispatch, props) => {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStatetoProps,
  mapActionToProps
)(Main);
