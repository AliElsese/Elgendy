import {
  GET_ALL_SALE_INVOICES,
  CREATE_NEW_SALE_INVOICE,
  GET_ONE_SALE_INVOICE,
  UPDATE_SALE_INVOICE,
  DELETE_SALE_INVOICE,
  PRINT_SALE_INVOICE,
  PRINT_ONE_SALE_INVOICE,
} from "../type";

const inital = {
  createSaleInvoice: [],
  allSaleInvoice: [],
  oneSaleInvoice: [],
  updateSaleInvoice: [],
  deleteSaleInvoice: [],
  printSaleInvoice: [],
  printOneSaleInvoice: [],
};
const saleInvoiceReducer = (state = inital, action) => {
  switch (action.type) {
    case CREATE_NEW_SALE_INVOICE:
      return {
        ...state,
        createSaleInvoice: action.payload,
      };
    case GET_ALL_SALE_INVOICES:
      return {
        ...state,
        allSaleInvoice: action.payload,
      };
    case GET_ONE_SALE_INVOICE:
      return {
        ...state,
        oneSaleInvoice: action.payload,
      };
    case UPDATE_SALE_INVOICE:
      return {
        ...state,
        updateSaleInvoice: action.payload,
      };
    case DELETE_SALE_INVOICE:
      return {
        ...state,
        deleteSaleInvoice: action.payload,
      };

    case PRINT_SALE_INVOICE:
      return {
        ...state,
        printSaleInvoice: action.payload,
      };
    case PRINT_ONE_SALE_INVOICE:
      return {
        ...state,
        printOneSaleInvoice: action.payload,
      };
    default:
      return state;
  }
};
export default saleInvoiceReducer;
