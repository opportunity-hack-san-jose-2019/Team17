import {
  GET_PROFILE,
  EDIT_PROFILE,
  EDIT_SWITCH,
  CALL_COMPLETE
} from "../actions/profileActions";
export default function profileReducer(state = {}, { type, payload }) {
  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        requestMessage: "Getting User Profile..."
      };
    case EDIT_PROFILE:
      return {
        ...state,
        requestMessage: "Editing User Profile..."
      };
    case EDIT_SWITCH:
      return {
        ...state,
        edit: payload.edit
      };

    case CALL_COMPLETE:
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
}
