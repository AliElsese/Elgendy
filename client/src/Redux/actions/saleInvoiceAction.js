import { useGetDataToken } from "../../hooks/useGetData";
import { useInsertData } from "../../hooks/useInsertData";
import { useUpdateData } from "../../hooks/useUpdateData";
import useDeleteData from "../../hooks/useDeleteData";
import {
  GET_ALL_SALE_INVOICES,
  CREATE_NEW_SALE_INVOICE,
  GET_ONE_SALE_INVOICE,
  UPDATE_SALE_INVOICE,
  DELETE_SALE_INVOICE,
  PRINT_SALE_INVOICE,
  PRINT_ONE_SALE_INVOICE,
} from "../type";

//get All saleInvoice
export const getAllSaleInvoice = () => async (dispatch) => {
  try {
    const response = await useGetDataToken(`/saleInvoice/getInvoices`);

    dispatch({
      type: GET_ALL_SALE_INVOICES,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ALL_SALE_INVOICES,
      payload: e.response,
    });
  }
};
//create new SaleInvoice
export const createNewSaleInvoice = (data) => async (dispatch) => {
  try {
    const response = await useInsertData(`/saleInvoice/addInvoice`, data);
    dispatch({
      type: CREATE_NEW_SALE_INVOICE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: CREATE_NEW_SALE_INVOICE,
      payload: e.response,
    });
  }
};

// get one SaleInvoice
export const getOneSaleInvoice = (id) => async (dispatch) => {
  try {
    const response = await useGetDataToken(`/saleInvoice/getInvoice/${id}`);

    dispatch({
      type: GET_ONE_SALE_INVOICE,

      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ONE_SALE_INVOICE,

      payload: e.response,
    });
  }
};
// update SaleInvoice
export const updateSaleInvoice = (id, body) => async (dispatch) => {
  try {
    const response = await useUpdateData(
      `/saleInvoice/updateProduct/${id}`,
      body
    );

    dispatch({
      type: UPDATE_SALE_INVOICE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_SALE_INVOICE,
      payload: e.response,
    });
  }
};
//delete SaleInvoice with id
export const deleteSaleInvoice = (id) => async (dispatch) => {
  try {
    const response = await useDeleteData(`/saleInvoice/deleteInvoice/${id}`);

    dispatch({
      type: DELETE_SALE_INVOICE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: DELETE_SALE_INVOICE,
      payload: e.response,
    });
  }
};
//print SaleInvoice
export const printSaleInvoice = () => async (dispatch) => {
  try {
    const response = await useInsertData(`/saleInvoice/getInvoicesReport`);

    dispatch({
      type: PRINT_SALE_INVOICE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: PRINT_SALE_INVOICE,
      payload: e.response,
    });
  }
};
//print one SaleInvoice
export const printOneSaleInvoice = (data) => async (dispatch) => {
  try {
    const response = await useInsertData(
      `/saleInvoice/generateSingleInvoice`,
      data
    );

    dispatch({
      type: PRINT_ONE_SALE_INVOICE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: PRINT_ONE_SALE_INVOICE,
      payload: e.response,
    });
  }
};
