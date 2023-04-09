import {
  GET_ALL_COMPANY,
  CREATE_NEW_COMPANY,
  GET_ONE_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
} from "../type";

const inital = {
  createCompany: [],
  allCompany: [],
  oneCompany: [],
  updateCompany: [],
  deleteCompany: [],
};
const companyReducer = (state = inital, action) => {
  switch (action.type) {
    case CREATE_NEW_COMPANY:
      return {
        ...state,
        createCompany: action.payload,
      };
    case GET_ALL_COMPANY:
      return {
        ...state,
        allCompany: action.payload,
      };
    case GET_ONE_COMPANY:
      return {
        ...state,
        oneCompany: action.payload,
      };
    case UPDATE_COMPANY:
      return {
        ...state,
        updateCompany: action.payload,
      };
    case DELETE_COMPANY:
      return {
        ...state,
        deleteCompany: action.payload,
      };

    default:
      return state;
  }
};
export default companyReducer;
