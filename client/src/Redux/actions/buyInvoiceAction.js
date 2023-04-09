import { useGetDataToken } from "../../hooks/useGetData";
import {
  useInsertData,
  useInsertDataWithFile,
} from "../../hooks/useInsertData";
import { useUpdateData } from "../../hooks/useUpdateData";
import useDeleteData from "../../hooks/useDeleteData";
import {
  GET_ALL_BUY_INVOICES,
  CREATE_NEW_BUY_INVOICE,
  GET_ONE_BUY_INVOICE,
  UPDATE_BUY_INVOICE,
  DELETE_BUY_INVOICE,
  CREATE_NEW_PDF_BUY_INVOICE,
  PRINT_BUY_INVOICE,
} from "../type";

//get All BuyInvoice
export const getAllBuyInvoice = () => async (dispatch) => {
  try {
    const response = await useGetDataToken(`/buyInvoice/getInvoices`);

    dispatch({
      type: GET_ALL_BUY_INVOICES,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ALL_BUY_INVOICES,
      payload: e.response,
    });
  }
};

//create new BuyInvoice
export const createNewBuyInvoice = (data) => async (dispatch) => {
  try {
    const response = await useInsertData(`/buyInvoice/addInvoice`, data);
    dispatch({
      type: CREATE_NEW_BUY_INVOICE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: CREATE_NEW_BUY_INVOICE,
      payload: e.response,
    });
  }
};
//create new BuyPdfInvoice
export const createNewPdfBuyInvoice = (formData) => async (dispatch) => {
  try {
    const response = await useInsertDataWithFile(
      `/buyInvoice/saveInvoice`,
      formData
    );
    dispatch({
      type: CREATE_NEW_PDF_BUY_INVOICE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: CREATE_NEW_PDF_BUY_INVOICE,
      payload: e.response,
    });
  }
};

// get one BuyInvoice
export const getOneBuyInvoice = (id) => async (dispatch) => {
  try {
    const response = await useGetDataToken(`/buyInvoice/getInvoice/${id}`);

    dispatch({
      type: GET_ONE_BUY_INVOICE,

      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ONE_BUY_INVOICE,

      payload: e.response,
    });
  }
};
// update BuyInvoice
export const updateBuyInvoice = (id, body) => async (dispatch) => {
  try {
    const response = await useUpdateData(
      `/buyInvoice/updateProduct/${id}`,
      body
    );

    dispatch({
      type: UPDATE_BUY_INVOICE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_BUY_INVOICE,
      payload: e.response,
    });
  }
};
//delete BuyInvoice with id
export const deleteBuyInvoice = (id) => async (dispatch) => {
  try {
    const response = await useDeleteData(`/buyInvoice/deleteInvoice/${id}`);

    dispatch({
      type: DELETE_BUY_INVOICE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: DELETE_BUY_INVOICE,
      payload: e.response,
    });
  }
};
//print BuyInvoice
export const printBuyInvoice = () => async (dispatch) => {
  try {
    const response = await useInsertData(`/buyInvoice/getInvoicesReport`);

    dispatch({
      type: PRINT_BUY_INVOICE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: PRINT_BUY_INVOICE,
      payload: e.response,
    });
  }
};
