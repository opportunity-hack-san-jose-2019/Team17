import axios from 'axios';
import {rootUrl} from "../components/helpers/urlhelper";
export const GET_COURSES="getcourseshome";
export const CALL_COMPLETE="callcompletehome";

require("../components/helpers/actionInterceptor")(axios);

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
export function changeListOrder(data){
    return {
        type:CALL_COMPLETE,
        payload:{courseList:data}
    }
}
export function getcourses(data){
    return (dispatch)=>{

        (async()=>{
            try{
                dispatch(requestMade(GET_COURSES));
                let response=await axios.post(rootUrl+"/courses",data);
                if(response.status===200){
                        // this.setState({
                        //     courseList:response.data
                        // });
                        let colors=["#0b9be3","#324a4d","#d41e00","#06A3B7","#009606"];
                        let respArray=response.data.map((data,index)=>{
                            return {
                                ...data,
                                color:colors[index]
                            }
                        })
                        dispatch(callcomplete({courseList:respArray}));
                }
            }catch(error){
                throw error;
            }
        })();
       
    }
}