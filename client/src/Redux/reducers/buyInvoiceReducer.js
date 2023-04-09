import {
  GET_ALL_BUY_INVOICES,
  CREATE_NEW_BUY_INVOICE,
  GET_ONE_BUY_INVOICE,
  UPDATE_BUY_INVOICE,
  DELETE_BUY_INVOICE,
  CREATE_NEW_PDF_BUY_INVOICE,
  PRINT_BUY_INVOICE
} from "../type";

const inital = {
  createBuyInvoice: [],
  createPdfBuyInvoice: [],
  allBuyInvoice: [],
  oneBuyInvoice: [],
  updateBuyInvoice: [],
  deleteBuyInvoice: [],
  printBuyInvoice: [],
};
const buyInvoiceReducer = (state = inital, action) => {
  switch (action.type) {
    case CREATE_NEW_BUY_INVOICE:
      return {
        ...state,
        createBuyInvoice: action.payload,
      };
    case GET_ALL_BUY_INVOICES:
      return {
        ...state,
        allBuyInvoice: action.payload,
      };
    case GET_ONE_BUY_INVOICE:
      return {
        ...state,
        oneBuyInvoice: action.payload,
      };
    case UPDATE_BUY_INVOICE:
      return {
        ...state,
        updateBuyInvoice: action.payload,
      };
    case DELETE_BUY_INVOICE:
      return {
        ...state,
        deleteBuyInvoice: action.payload,
      };
    case CREATE_NEW_PDF_BUY_INVOICE:
      return {
        ...state,
        createPdfBuyInvoice: action.payload,
      };
    case PRINT_BUY_INVOICE:
      return {
        ...state,
        printBuyInvoice: action.payload,
      };

    default:
      return state;
  }
};
export default buyInvoiceReducer;
