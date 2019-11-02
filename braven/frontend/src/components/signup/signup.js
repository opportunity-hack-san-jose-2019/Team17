import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from "react-cookies";
import img from "../images/sjsuhead.png";
import img2 from "../images/sjsuheader.png";
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {signupuser,signupreset} from '../../actions/signupActions';

class Signup extends Component {

  constructor(props){
    super(props)

    this.state={
      name:"",
      email:"",
      password:"",
      signupSuccess:0,
      message:"",
      role:"student"
    }

    this.signup=this.signup.bind(this);
    props.onSignupreset();
  }
  changeHandlerName=(e)=>{
    this.setState({
      name:e.target.value
    });
  }

  changeHandlerEmail=(e)=>{
    this.setState({
      email:e.target.value
    });
  }

  changeHandlerPassword=(e)=>{
    this.setState({
      password:e.target.value
    });
  }
  changeHandlerRadio=(e)=>{
    this.setState({
      role:e.target.value
    });
  }

  async signup(e){

    e.preventDefault();

    let {name,email,password,role}=this.state;
    var data={
     name,
     email,
     password,
     role
    }

    this.props.onSignupUser(data);

    

  }

  render() {
    let redirectVar = null;
    if(this.props.signup.signupSuccess){
        redirectVar = <Redirect to= "/login"/>
    }
    if(cookie.load("cookie")){
      redirectVar=<Redirect to="/home"/>
  }
      return(<div>
          <header className="login-header"><span>Connecting to</span><span><img src={img}></img></span>
        <p>Sign-in with your San Jose State University account to access SJSU Single Sign-on</p>
        </header>
        <div>{redirectVar}</div>
        <form className="login-form" onSubmit={this.signup}>
        <div className="img-parent"><img src={img2}></img></div>
        <p>Sign Up</p>
        <div className="input-parent">
       <div> <input required onChange={this.changeHandlerName} type="text" placeholder="Name"></input></div>
       <div className="radio-parent"><input type="radio" onChange={this.changeHandlerRadio} checked={this.state.role==="student"} name="role"  value="student"></input><label>Student</label></div>
       <div className="radio-parent"><input type="radio" onChange={this.changeHandlerRadio} checked={this.state.role==="faculty"} name="role" value="faculty"></input><label>Faculty</label></div>
       <div> <input required title="Please enter an email address of the form xyz@sjsu.edu"  type="email" pattern=".+@sjsu.edu" onChange={this.changeHandlerEmail}  placeholder="Email"></input></div>
       <div><input required onChange={this.changeHandlerPassword} type="password" placeholder="Password"></input></div>
        <input className="btn" type="submit" value="Sign Up"></input>
        </div>
        <div className="sign-up"><span>Already registered ? </span><Link to="/login">Sign In</Link></div>
        </form>
        <div>{this.state.message}</div>
      </div>)
  }
}
const mapStatetoProps=(state,props)=>{
  return{
    ...state,
    ...props
  };
}
const mapActionToProps=(dispatch,props)=>{
 return bindActionCreators({
  onSignupUser:signupuser,
  onSignupreset:signupreset
 },dispatch);
}

export default connect(mapStatetoProps,mapActionToProps)(Signup);

