import { useGetDataToken } from "../../hooks/useGetData";
import { useInsertData } from "../../hooks/useInsertData";
import { useUpdateData } from "../../hooks/useUpdateData";
import useDeleteData from "../../hooks/useDeleteData";
import {
  GET_ALL_PRODUCTS,
  CREATE_NEW_PRODUCT,
  GET_ONE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  PRINT_PRODUCT,
  GET_PRODUCT_CODE,
} from "../type";

//get All Product
export const getAllProduct = () => async (dispatch) => {
  try {
    const response = await useGetDataToken(`/api/products/getProducts`);

    dispatch({
      type: GET_ALL_PRODUCTS,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ALL_PRODUCTS,
      payload: e.response,
    });
  }
};

//create new Product
export const createNewProduct = (data) => async (dispatch) => {
  try {
    const response = await useInsertData(`/api/products/addProduct`, data);
    dispatch({
      type: CREATE_NEW_PRODUCT,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: CREATE_NEW_PRODUCT,
      payload: e.response,
    });
  }
};

// get one Product
export const getOneProduct = (id) => async (dispatch) => {
  try {
    const response = await useGetDataToken(`/api/products/getProduct/${id}`);

    dispatch({
      type: GET_ONE_PRODUCT,

      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ONE_PRODUCT,

      payload: e.response,
    });
  }
};
// getProductCode
export const getProductCode = (body) => async (dispatch) => {
  try {
    const response = await useInsertData("/api/products/getProductCode", body);

    dispatch({
      type: GET_PRODUCT_CODE,

      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_PRODUCT_CODE,

      payload: e.response,
    });
  }
};
// update Product
export const updateProduct = (id, body) => async (dispatch) => {
  try {
    const response = await useUpdateData(`/api/products/updateProduct/${id}`, body);

    dispatch({
      type: UPDATE_PRODUCT,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_PRODUCT,
      payload: e.response,
    });
  }
};
//delete Product with id
export const deleteProduct = (id) => async (dispatch) => {
  try {
    const response = await useDeleteData(`/api/products/deleteProduct/${id}`);

    dispatch({
      type: DELETE_PRODUCT,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: DELETE_PRODUCT,
      payload: e.response,
    });
  }
};
//print Products
export const printAllProduct = () => async (dispatch) => {
  try {
    const response = await useInsertData(`/api/products/getProductsReport`);

    dispatch({
      type: PRINT_PRODUCT,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: PRINT_PRODUCT,
      payload: e.response,
    });
  }
};
