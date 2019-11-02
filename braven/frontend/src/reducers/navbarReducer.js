import {GET_PROFILE,CALL_COMPLETE} from '../actions/navbarActions';
export default function navbarReducer(state={imageUrl:""},{type,payload}){
    switch(type){
        case GET_PROFILE:
        return{
            ...state,
            requestMessage:"Getting Profile..."
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