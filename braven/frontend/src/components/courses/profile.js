import React, { Component } from 'react';
import axios from "axios";
import {Redirect} from "react-router";
// import { Link } from 'react-router-dom'
import cookie from 'react-cookies';
import { rootUrl } from '../helpers/urlhelper';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getprofile} from '../../actions/profileActions';
import stockimg from "../images/stockuser.png";
class Profile extends Component {

  constructor(props){
    super(props);
    this.state={
      edit:0,
      imageUrl:""
    }
    let details;
    this.changeHandlerCommon=this.changeHandlerCommon.bind(this);
    if(cookie.load("cookie")){
     details=cookie.load("cookie");
     this.state={
      edit:0,
      uid:props.match.params.uid
    }
    }
  }
  getprofiledetails=()=>{
   this.props.onGetProfile(this.state.uid);
  }
  componentDidMount(){
  this.getprofiledetails();
  }
  submit=(e)=>{
    e.preventDefault();
    (async()=>{
     try{
       let obj={...this.state};
       console.log(obj);
      // let file=this.state.file;
       const data = new FormData()
       data.append('file', this.state.file, this.state.file.name);
       data.set('uid', this.state.uid);
       data.set('name', this.state.name.toString());
       data.set('phoneNumber', this.state.phoneNumber.toString());
       data.set('aboutMe', this.state.aboutMe.toString());
       data.set('city', this.state.city.toString());
       data.set('country', this.state.country.toString());
       data.set('school', this.state.school.toString());
       data.set('hometown', this.state.hometown.toString());
       data.set('languages', this.state.languages.toString());
       data.set('gender', this.state.gender.toString());

        let result=await axios.post(rootUrl+"/courses/updateprofile",data);
        if(result.status===200){
          alert("Profile Updated");
          this.setState({
            edit:0
          });
          this.getprofiledetails();
        }
      }catch(error){
        console.log(error);
      }
    })();
  }

  cancel=()=>{
    this.setState({
      edit:0
    });
  }
  editon=()=>{
    this.setState({
      edit:1
    });
  }
  handleFile=(e)=>{
    this.setState({
        message:"",
        file:e.target.files[0]
    })
}
  changeHandlerCommon(property,e){
    this.setState({
      [property]:e.target.value
    })
}
changeHandlerRadio=(e)=>{
  this.setState({
    gender:e.target.value
  });
}
  render() {
    let redirectVar=null;
    let detailsVar=null;
    if(this.state.edit){
      detailsVar=<div className="view-parent">
        <form onSubmit={this.submit}>
      <div><span>Name : </span><input value={this.state.name} required type="text" onChange={(e)=>{this.changeHandlerCommon("name",e)}}></input></div>
      <div><input required onChange={this.handleFile} type="file"></input></div>
      <div><span>Number : </span><input value={this.state.phoneNumber} type="number" onChange={(e)=>{this.changeHandlerCommon("phoneNumber",e)}}></input></div>
      <div><span>About Me : </span><input value={this.state.aboutMe} type="text" onChange={(e)=>{this.changeHandlerCommon("aboutMe",e)}}></input></div>
      <div><span>City : </span><input value={this.state.city} type="text" onChange={(e)=>{this.changeHandlerCommon("city",e)}}></input></div>
      <div><span>Country : </span><input value={this.state.country} type="text" onChange={(e)=>{this.changeHandlerCommon("country",e)}}></input></div>
      <div><span>School : </span><input value={this.state.school} type="text" onChange={(e)=>{this.changeHandlerCommon("school",e)}}></input></div>
      <div><span>Hometown : </span><input value={this.state.hometown} type="text" onChange={(e)=>{this.changeHandlerCommon("hometown",e)}}></input></div>
      <div><span>Languages : </span><input type="text" value={this.state.languages} onChange={(e)=>{this.changeHandlerCommon("languages",e)}}></input></div>
      <div><input type="radio" onChange={this.changeHandlerRadio} checked={this.state.gender==="male"} name="role"  value="male"></input><label>Male</label></div>
      <div><input type="radio" onChange={this.changeHandlerRadio} checked={this.state.gender==="female"} name="role" value="female"></input><label>Female</label></div>
      <div><input type="submit" value="submit"></input></div>
      <div><button onClick={this.cancel} type="submit">Cancel</button></div>
      </form>

      </div>
    }else{
      detailsVar=<div>
        <img src={this.props.profile.file?this.props.profile.file:stockimg}></img>
        {/* <button onClick={this.editon}>Edit</button> */}
        <div className="view-parent">
        <div><span>User Id  : </span><span>{this.props.profile.uid}</span></div>
        <div><span>Name : </span><span>{this.props.profile.name}</span></div>
        <div><span>Phone Number : </span><span>{this.props.profile.phoneNumber}</span></div>
        <div><span>About Me : </span><span>{this.props.profile.aboutMe}</span></div>
        <div><span>City : </span><span>{this.props.profile.city}</span></div>
        <div><span>Country : </span><span>{this.props.profile.country}</span></div>
        <div><span>School : </span><span>{this.props.profile.school}</span></div>
        <div><span>Languages : </span><span>{this.props.profile.languages}</span></div>
        <div><span>Hometown : </span><span>{this.props.profile.hometown}</span></div>
        <div><span>Gender : </span><span>{this.props.profile.gender}</span></div>
        </div>
      </div>
    }
    if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
    return (
       
     <div className="ml90 profile-page-parent search-parent">
     <h2>Profle Details</h2>
      {redirectVar}
     {detailsVar}
     </div>
     
       
    )
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
  onGetProfile:getprofile
 },dispatch);
}
export default connect(mapStatetoProps,mapActionToProps)(Profile);