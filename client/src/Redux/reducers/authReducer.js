import { LOGIN_USER,ACTIVE_CODE } from "../type";

const inital = {
  loginUser: [],
  activeCode:[]
};
const authReducer = (state = inital, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loginUser: action.payload,
      };
    case ACTIVE_CODE:
      return {
        ...state,
        activeCode: action.payload,
      };

    default:
      return state;
  }
};
export default authReducer;
