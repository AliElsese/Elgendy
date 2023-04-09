import { useGetDataToken } from "../../hooks/useGetData";
import { useInsertData } from "../../hooks/useInsertData";
import { useUpdateData } from "../../hooks/useUpdateData";
import useDeleteData from "../../hooks/useDeleteData";
import {
  GET_ALL_STORES,
  CREATE_NEW_STORE,
  GET_ONE_STORE,
  UPDATE_STORE,
  DELETE_STORE,
  PRINT_STORE,
} from "../type";

//get All Store
export const getAllStore = () => async (dispatch) => {
  try {
    const response = await useGetDataToken(`/store/getStoreProducts`);

    dispatch({
      type: GET_ALL_STORES,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ALL_STORES,
      payload: e.response,
    });
  }
};

//create new Store
export const createNewStore = (data) => async (dispatch) => {
  try {
    const response = await useInsertData(`/store/addStoreProduct/`, data);
    dispatch({
      type: CREATE_NEW_STORE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: CREATE_NEW_STORE,
      payload: e.response,
    });
  }
};

// get one Store
export const getOneStore = (id) => async (dispatch) => {
  try {
    const response = await useGetDataToken(`/store/getStoreProduct/${id}`);

    dispatch({
      type: GET_ONE_STORE,

      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ONE_STORE,

      payload: e.response,
    });
  }
};
// update Store
export const updateStore = (id, body) => async (dispatch) => {
  try {
    const response = await useUpdateData(
      `/store/updateStoreProduct/${id}`,
      body
    );

    dispatch({
      type: UPDATE_STORE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_STORE,
      payload: e.response,
    });
  }
};
//delete Store with id
export const deleteStore = (id) => async (dispatch) => {
  try {
    const response = await useDeleteData(`/store/deleteStoreProduct/${id}`);

    dispatch({
      type: DELETE_STORE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: DELETE_STORE,
      payload: e.response,
    });
  }
};
//Print Store
export const printStore = () => async (dispatch) => {
  try {
    const response = await useInsertData(`/store/getStoreReport`);

    dispatch({
      type: PRINT_STORE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: PRINT_STORE,
      payload: e.response,
    });
  }
};
