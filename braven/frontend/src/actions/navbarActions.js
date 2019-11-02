import axios from 'axios';
import cookie from 'react-cookies'
import {rootUrl} from "../components/helpers/urlhelper";
export const GET_PROFILE="getprofilenavbar";
export const GET_COURSELIST="getcourselist";
export const CALL_COMPLETE="callcompletenavbar";


export function callcomplete(obj){
    return {
        type:CALL_COMPLETE,
        payload:obj
    }
}
export function requestMade(data){
    return {
        type:data,
        payload:""
    }
}
export function getcourselist(cookieData){
    return (dispatch)=>{
        (async()=>{

            try{
                dispatch(requestMade(GET_COURSELIST));
                let list=[];
                let result=await axios.post(rootUrl+"/courses",cookieData);
              if(result.status===200){
               
                 list=result.data.map((data)=>{
                  let courseTerm=data.courseTerm.toLowerCase().indexOf("spring")>-1?"SP":"FALL";
                  let year=data.courseTerm.split(" ")[1].substr(-2);
                  let link="/courses/"+data.cid.toString();
                  return {name:`${courseTerm+year} : ${data.courseDepartment} ${data.courseId} - ${data.courseName}`,link:link}
                });
              }
              if(cookieData.role==="student"){
                list.unshift({name:"Search and Enroll in a course",link:"/course/searchcourse"}); 
               }else{
                list.unshift({name:"Create a Course",link:"/course/createcourse"});
               }
                dispatch(callcomplete({list}));
              }catch(error){
                console.log(error);
              }
        })();
    }
}
export function getprofile(uid){
    return (dispatch)=>{

        (async()=>{
            try {
                dispatch(requestMade(GET_PROFILE));
              let result=await axios.get(rootUrl+"/courses/getprofilebyid/"+uid);
              if(result.status===200){
                let {uid,name,phoneNumber,profileImage:file,aboutMe,city,country,school,hometown,languages,gender}=result.data[0];
                var imageUrl =null;
                if(file){
                var arrayBufferView = new Uint8Array( file.data );
                var blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
                var urlCreator = window.URL || window.webkitURL;
               imageUrl = urlCreator.createObjectURL( blob );
                }
                dispatch(callcomplete({
                    uid,name,phoneNumber,file,aboutMe,city,country,school,hometown,languages,gender,imageUrl
                  }));
              }
            } catch (error) {
              console.log(error);
            }
          })();
    }
}