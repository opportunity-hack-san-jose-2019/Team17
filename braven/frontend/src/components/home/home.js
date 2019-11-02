import React, { Component } from "react";
import axios from "axios";
import { rootUrl } from "../helpers/urlhelper";
import { Redirect } from "react-router";
import cookie from "react-cookies";
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getcourses, changeListOrder } from "../../actions/homeActions";
import arrayMove from "array-move";

import announcementSVG from "../images/announcements.svg";
// import profileSVG from "../images/dashboard.svg"
import assignmentSVG from "../images/assignments.svg";
import filesSVG from "../images/files.svg";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseList: [],
      colors: ["#0b9be3", "#324a4d", "#d41e00", "#06A3B7", "#009606"]
    };
  }
  async componentDidMount() {
    let data = cookie.load("cookie");
  }

  render() {
    let redirectVar = null;
    console.log(cookie.load("cookie"));
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    return (
      <div className="home-dashboard">
        <div>{redirectVar}</div>

        <h2>Dashboard</h2>
        <div></div>
      </div>
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
  return bindActionCreators(
    {
      onGetCourses: getcourses,
      onchangeListOrder: changeListOrder
    },
    dispatch
  );
};

export default connect(
  mapStatetoProps,
  mapActionToProps
)(Home);
