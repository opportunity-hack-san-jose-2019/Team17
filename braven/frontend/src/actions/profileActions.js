import axios from "axios";
import cookie from "react-cookies";
import { rootUrl } from "../components/helpers/urlhelper";
export const GET_PROFILE = "getprofile";
export const EDIT_PROFILE = "editprofile";
export const CALL_COMPLETE = "callcompleteprofile";
export const EDIT_SWITCH = "editswitch";

export function editSwitch(data) {
  return {
    type: EDIT_SWITCH,
    payload: { edit: data }
  };
}
export function callcomplete(obj) {
  return {
    type: CALL_COMPLETE,
    payload: obj
  };
}
export function requestMade(data) {
  return {
    type: data,
    payload: ""
  };
}
export function getprofile(data) {
  return dispatch => {
    (async () => {
      try {
        dispatch(requestMade(GET_PROFILE));
        let result = await axios.get(rootUrl + "/getprofilebyid/" + data);
        if (result.status === 200) {
          let {
            uid,
            name,
            phoneNumber,
            profileImage: file,
            aboutMe,
            city,
            country,
            school,
            hometown,
            languages,
            gender
          } = result.data[0];
          var imageUrl = null;
          if (file) {
            var arrayBufferView = new Uint8Array(file.data);
            var blob = new Blob([arrayBufferView], { type: "image/png" });
            var urlCreator = window.URL || window.webkitURL;
            imageUrl = urlCreator.createObjectURL(blob);
          }
          dispatch(
            callcomplete({
              uid,
              name,
              phoneNumber,
              file,
              aboutMe,
              city,
              country,
              school,
              hometown,
              languages,
              gender,
              imageUrl
            })
          );
        }
      } catch (error) {
        alert(error);
      }
    })();
  };
}
export function editprofile(obj) {
  return dispatch => {
    (async () => {
      try {
        dispatch(requestMade(EDIT_PROFILE));
        console.log();
        const data = new FormData();
        data.append("file", obj.file, obj.file.name);
        data.set("uid", obj.uid);
        data.set("name", obj.name.toString());
        data.set("phoneNumber", obj.phoneNumber.toString());
        data.set("aboutMe", obj.aboutMe.toString());
        data.set("city", obj.city.toString());
        data.set("country", obj.country.toString());
        data.set("school", obj.school.toString());
        data.set("hometown", obj.hometown.toString());
        data.set("languages", obj.languages.toString());
        data.set("gender", obj.gender.toString());

        let result = await axios.post(rootUrl + "/updateprofile", data);
        if (result.status === 200) {
          alert("Profile Updated Successfully");
          dispatch(
            callcomplete({ edit: 0, message: "Profile Update Successful" })
          );
          dispatch(getprofile(obj.uid));
        }
      } catch (error) {
        console.log(error);
      }
    })();
  };
}
