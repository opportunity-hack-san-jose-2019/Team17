import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router";
// import { Link } from 'react-router-dom'
import cookie from "react-cookies";
import { rootUrl } from "../helpers/urlhelper";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  getprofile,
  editSwitch,
  editprofile
} from "../../actions/profileActions";
import stockimg from "../images/stockuser.png";
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: 0,
      imageUrl: ""
    };
    let details;
    this.changeHandlerCommon = this.changeHandlerCommon.bind(this);
    if (cookie.load("cookie")) {
      details = cookie.load("cookie");
      this.state = {
        edit: 0,
        uid: details.email
      };
    }
  }
  getprofiledetails = () => {
    this.props.onGetProfile(this.state.uid);
  };
  componentDidMount() {
    this.getprofiledetails();
  }
  submit = e => {
    e.preventDefault();
    let obj = { ...this.state };
    this.props.onEditProfile(obj);
  };

  cancel = () => {
    this.props.onEditSwitch(0);
  };
  editon = () => {
    this.setState({
      ...this.props.profile
    });
    this.props.onEditSwitch(1);
  };
  handleFile = e => {
    this.setState({
      message: "",
      file: e.target.files[0]
    });
  };
  changeHandlerCommon(property, e) {
    this.setState({
      [property]: e.target.value
    });
  }
  changeHandlerRadio = e => {
    this.setState({
      gender: e.target.value
    });
  };
  render() {
    let redirectVar = null;
    let detailsVar = null;
    if (this.props.profile.edit) {
      detailsVar = (
        <div className="view-parent">
          <form onSubmit={this.submit}>
            <div>
              <span>Name : </span>
              <input
                value={this.state.name}
                required
                type="text"
                onChange={e => {
                  this.changeHandlerCommon("name", e);
                }}
              ></input>
            </div>
            <div>
              <input required onChange={this.handleFile} type="file"></input>
            </div>
            <div>
              <span>Number : </span>
              <input
                value={this.state.phoneNumber}
                type="number"
                onChange={e => {
                  this.changeHandlerCommon("phoneNumber", e);
                }}
              ></input>
            </div>
            <div>
              <span>About Me : </span>
              <input
                value={this.state.aboutMe}
                type="text"
                onChange={e => {
                  this.changeHandlerCommon("aboutMe", e);
                }}
              ></input>
            </div>
            <div>
              <span>City : </span>
              <input
                value={this.state.city}
                type="text"
                onChange={e => {
                  this.changeHandlerCommon("city", e);
                }}
              ></input>
            </div>
            <div>
              <span>Country : </span>
              <input
                value={this.state.country}
                type="text"
                onChange={e => {
                  this.changeHandlerCommon("country", e);
                }}
              ></input>
            </div>
            <div>
              <span>School : </span>
              <input
                value={this.state.school}
                type="text"
                onChange={e => {
                  this.changeHandlerCommon("school", e);
                }}
              ></input>
            </div>
            <div>
              <span>Hometown : </span>
              <input
                value={this.state.hometown}
                type="text"
                onChange={e => {
                  this.changeHandlerCommon("hometown", e);
                }}
              ></input>
            </div>
            <div>
              <span>Languages : </span>
              <input
                type="text"
                value={this.state.languages}
                onChange={e => {
                  this.changeHandlerCommon("languages", e);
                }}
              ></input>
            </div>
            <div>
              <input
                type="radio"
                onChange={this.changeHandlerRadio}
                checked={this.state.gender === "male"}
                name="role"
                value="male"
              ></input>
              <label>Male</label>
            </div>
            <div>
              <input
                type="radio"
                onChange={this.changeHandlerRadio}
                checked={this.state.gender === "female"}
                name="role"
                value="female"
              ></input>
              <label>Female</label>
            </div>
            <div>
              <input type="submit" value="submit"></input>
            </div>
            <div>
              <button onClick={this.cancel} type="submit">
                Cancel
              </button>
            </div>
          </form>
        </div>
      );
    } else {
      let { profile: obj } = this.props;
      detailsVar = (
        <div>
          <img src={obj.file ? obj.file : stockimg}></img>
          <button onClick={this.editon}>Edit</button>
          <div className="view-parent">
            <div>
              <span>User Id : </span>
              <span>{obj.uid}</span>
            </div>
            <div>
              <span>Name : </span>
              <span>{obj.name}</span>
            </div>
            <div>
              <span>Phone Number : </span>
              <span>{obj.phoneNumber}</span>
            </div>
            <div>
              <span>About Me : </span>
              <span>{obj.aboutMe}</span>
            </div>
            <div>
              <span>City : </span>
              <span>{obj.city}</span>
            </div>
            <div>
              <span>Country : </span>
              <span>{obj.country}</span>
            </div>
            <div>
              <span>School : </span>
              <span>{obj.school}</span>
            </div>
            <div>
              <span>Languages : </span>
              <span>{obj.languages}</span>
            </div>
            <div>
              <span>Hometown : </span>
              <span>{obj.hometown}</span>
            </div>
            <div>
              <span>Gender : </span>
              <span>{obj.gender}</span>
            </div>
          </div>
        </div>
      );
    }
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    return (
      <div className="ml90 profile-page-parent search-parent">
        <h2>Profle Details</h2>
        {redirectVar}
        {detailsVar}
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
      onGetProfile: getprofile,
      onEditSwitch: editSwitch,
      onEditProfile: editprofile
    },
    dispatch
  );
};
export default connect(
  mapStatetoProps,
  mapActionToProps
)(Profile);
