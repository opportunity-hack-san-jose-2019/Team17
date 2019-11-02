import React,{Fragment } from 'react';
import './App.css';
// import axios from "axios";
import { Route } from 'react-router-dom'

const AppRoute =({renderstyle,component:Component,layout:Layout,...rest})=>{
    let layoutVar=null;
    if(Layout){
        layoutVar= <Layout {...rest}></Layout>
    }
    let routeVar=null;
    if(renderstyle){
       routeVar= <Route {...rest} render={({match}) => {
            return(
                <Fragment>
       {layoutVar}
          <Component match={match} {...rest}></Component>
          </Fragment>
        )}} ></Route>
    }else{
        
      routeVar=  <Route {...rest} render={({match}) => {
            return(
                <Fragment>
       {layoutVar}
          <Component match={match} {...rest}></Component>
          </Fragment>
        )}} ></Route>
    }
     return(
         <Fragment>
        {routeVar}
        </Fragment>
       )
 
 }

export default AppRoute;