import { combineReducers } from "redux";
import authReducer from "./authReducer";
import productReducer from "./productReducer";
import buyInvoiceReducer from "./buyInvoiceReducer";
import storeReducer from "./storeReducer";
import saleInvoiceReducer from "./saleInvoiceReducer";
import userReducer from "./userReducer";
import companyReducer from './companyReducer';
export default combineReducers({
  authReducer: authReducer,
  productReducer: productReducer,
  buyInvoiceReducer: buyInvoiceReducer,
  storeReducer: storeReducer,
  saleInvoiceReducer: saleInvoiceReducer,
  userReducer: userReducer,
  companyReducer: companyReducer,
});
