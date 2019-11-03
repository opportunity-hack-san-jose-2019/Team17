import React, { Component } from "react";
import axios from "axios";
import { rootUrl } from "../helpers/urlhelper";
import { Redirect } from "react-router";
import cookie from "react-cookies";
import img from "../images/braven-logo.png";
import img2 from "../images/braven-logo.png";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loginuser } from "../../actions/loginActions";
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loginSuccess: 0,
      message: ""
    };

    this.login = this.login.bind(this);
  }

  changeHandlerEmail = e => {
    this.setState({
      email: e.target.value
    });
  };

  changeHandlerPassword = e => {
    this.setState({
      password: e.target.value
    });
  };

  async login(e) {
    e.preventDefault();
    let { email, password } = this.state;
    var data = {
      email,
      password
    };
    this.props.onLoginUser(data);
  }

  render() {
    let redirectVar = null;
    if (cookie.load("cookie")) {
      redirectVar = <Redirect to="/" />;
    }
    return (
      <div>
       <header className="login-header"><span>Braven</span><span><img src={img}></img></span>
        {/* <p>Sign-in with your San Jose State University account to access SJSU Single Sign-on</p> */}
        </header>
        <div>{redirectVar}</div>
        <form className="login-form" onSubmit={this.login}>
          <div className="img-parent">
            <img src={img2}></img><div>Braven</div>
          </div>
          <p>Sign In</p>
          <div className="input-parent">
            <div>
              {" "}
              <input
                required
                onChange={this.changeHandlerEmail}
                type="text"
                placeholder="Email"
              ></input>
            </div>
            <div>
              <input
                required
                onChange={this.changeHandlerPassword}
                type="password"
                placeholder="Password"
              ></input>
            </div>

            <div>
              <input className="btn" type="submit" value="Login"></input>
            </div>
          </div>
          <div className="sign-up">
            <span>New User ? </span>
            <Link to="/signup">Sign Up</Link>
          </div>
        </form>
        <div>{this.state.message}</div>
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
      onLoginUser: loginuser
    },
    dispatch
  );
};

export default connect(
  mapStatetoProps,
  mapActionToProps
)(Login);
