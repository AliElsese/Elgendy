import {
  GET_ALL_PRODUCTS,
  CREATE_NEW_PRODUCT,
  GET_ONE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  PRINT_PRODUCT,
  GET_PRODUCT_CODE,
} from "../type";

const inital = {
  createProduct: [],
  allProduct: [],
  oneProduct: [],
  updateProduct: [],
  deleteProduct: [],
  printProduct: [],
  getProductCode: [],
};
const productReducer = (state = inital, action) => {
  switch (action.type) {
    case CREATE_NEW_PRODUCT:
      return {
        ...state,
        createProduct: action.payload,
      };
    case GET_ALL_PRODUCTS:
      return {
        ...state,
        allProduct: action.payload,
      };
    case GET_ONE_PRODUCT:
      return {
        ...state,
        oneProduct: action.payload,
      };
    case UPDATE_PRODUCT:
      return {
        ...state,
        updateProduct: action.payload,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        deleteProduct: action.payload,
      };
    case PRINT_PRODUCT:
      return {
        ...state,
        printProduct: action.payload,
      };
    case GET_PRODUCT_CODE:
      return {
        getProductCode: action.payload,
      };

    default:
      return state;
  }
};
export default productReducer;
