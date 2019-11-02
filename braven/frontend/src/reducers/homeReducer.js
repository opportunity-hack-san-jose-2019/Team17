import {GET_COURSES,CALL_COMPLETE} from '../actions/homeActions';
export default function homeReducer(state={courseList:[]},{type,payload}){
    switch(type){
        case GET_COURSES:
        return{
            ...state,
            requestMessage:"Getting the users..."
        }
        case CALL_COMPLETE:
        return{
            ...state,
            ...payload
        }
        default:
        return state;
    }
}