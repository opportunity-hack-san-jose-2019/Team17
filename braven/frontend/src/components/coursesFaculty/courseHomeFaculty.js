import React, { Component } from "react";
import axios from "axios";
import { rootUrl } from "../helpers/urlhelper";
import { Redirect } from "react-router";
import cookie from "react-cookies";

class CourseHomeFaculty extends Component {
  constructor(props) {
    super(props);

    const { courseid } = props.match.params;
    let courseDepartment = courseid.replace(/[0-9]/g, "");
    let courseId = courseid.replace(/[^0-9]/g, "");
    console.log(courseid);
    this.state = {
      courseId,
      courseDepartment
    };
    console.log(JSON.stringify(this.state));
  }
  async componentDidMount() {
    // try{
    //     let response=await axios.post(rootUrl+"/courses",cookie.load("cookie"));
    //     if(response.status===200){
    //             this.setState({
    //                 courseList:response.data
    //             });
    //     }
    // }catch(error){
    //     throw error;
    // }
  }

  render() {
    let redirectVar = null;
    console.log(cookie.load("cookie"));
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    return (
      <div className="ml90">
        <Redirect to={`${this.props.match.url}/announcements`}></Redirect>
        Course Home Faculty Screen !
      </div>
    );
  }
}

export default CourseHomeFaculty;
