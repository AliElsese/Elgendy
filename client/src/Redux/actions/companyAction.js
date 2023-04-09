import { useGetDataToken } from "../../hooks/useGetData";
import { useInsertData } from "../../hooks/useInsertData";
import { useUpdateData } from "../../hooks/useUpdateData";
import useDeleteData from "./../../hooks/useDeleteData";
import {
  GET_ALL_COMPANY,
  CREATE_NEW_COMPANY,
  GET_ONE_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
} from "../type";

//get All Company
export const getAllCompany = () => async (dispatch) => {
  try {
    const response = await useGetDataToken("/api/companies/companies");

    dispatch({
      type: GET_ALL_COMPANY,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ALL_COMPANY,
      payload: e.response,
    });
  }
};

//create new company
export const createNewCompany = (data) => async (dispatch) => {
  try {
    const response = await useInsertData(`/api/companies/createCompany`, data);
    dispatch({
      type: CREATE_NEW_COMPANY,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: CREATE_NEW_COMPANY,
      payload: e.response,
    });
  }
};

// get one Company
export const getOneCompany = (id) => async (dispatch) => {
  try {
    const response = await useGetDataToken(`/api/companies/getCompany/${id}`);

    dispatch({
      type: GET_ONE_COMPANY,

      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ONE_COMPANY,

      payload: e.response,
    });
  }
};
// update Company
export const updateCompany = (id, body) => async (dispatch) => {
  try {
    const response = await useUpdateData(
      `/api/companies/updateCompany/${id}`,
      body
    );

    dispatch({
      type: UPDATE_COMPANY,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_COMPANY,
      payload: e.response,
    });
  }
};
//delete Company with id
export const deleteCompany = (id) => async (dispatch) => {
  try {
    const response = await useDeleteData(`/api/companies/deleteCompany/${id}`);

    dispatch({
      type: DELETE_COMPANY,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: DELETE_COMPANY,
      payload: e.response,
    });
  }
};
