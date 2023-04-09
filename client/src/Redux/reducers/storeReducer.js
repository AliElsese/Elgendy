import {
  GET_ALL_STORES,
  CREATE_NEW_STORE,
  GET_ONE_STORE,
  UPDATE_STORE,
  DELETE_STORE,
  PRINT_STORE,
} from "../type";

const inital = {
  createStore: [],
  allStore: [],
  oneStore: [],
  updateStore: [],
  deleteStore: [],
  printStore: [],
};
const storeReducer = (state = inital, action) => {
  switch (action.type) {
    case CREATE_NEW_STORE:
      return {
        ...state,
        createStore: action.payload,
      };
    case GET_ALL_STORES:
      return {
        ...state,
        allStore: action.payload,
      };
    case GET_ONE_STORE:
      return {
        ...state,
        oneStore: action.payload,
      };
    case UPDATE_STORE:
      return {
        ...state,
        updateStore: action.payload,
      };
    case DELETE_STORE:
      return {
        ...state,
        deleteStore: action.payload,
      };
    case PRINT_STORE:
      return {
        ...state,
        printStore: action.payload,
      };

    default:
      return state;
  }
};
export default storeReducer;
