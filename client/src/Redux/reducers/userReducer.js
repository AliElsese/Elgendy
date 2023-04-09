import {
  CREATE_NEW_USER,
  GET_ALL_USERS,
  GET_ONE_USER,
  UPDATE_USER,
  DELETE_USER,
} from "../type";

const inital = {
  createUser: [],
  allUsers: [],
  oneUser: [],
  updateUser: [],
  deleteUser: [],
};
const userReducer = (state = inital, action) => {
  switch (action.type) {
    case CREATE_NEW_USER:
      return {
        ...state,
        createUser: action.payload,
      };
    case GET_ALL_USERS:
      return {
        ...state,
        allUsers: action.payload,
      };
    case GET_ONE_USER:
      return {
        ...state,
        oneUser: action.payload,
      };
    case UPDATE_USER:
      return {
        ...state,
        updateUser: action.payload,
      };
    case DELETE_USER:
      return {
        ...state,
        deleteUser: action.payload,
      };

    default:
      return state;
  }
};
export default userReducer;
