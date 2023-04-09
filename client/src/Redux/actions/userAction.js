import { useInsertData } from "../../hooks/useInsertData";
import { useGetDataToken } from "../../hooks/useGetData";
import {
  CREATE_NEW_USER,
  GET_ALL_USERS,
  GET_ONE_USER,
  UPDATE_USER,
  DELETE_USER,
} from "../type";
import { useUpdateData } from "../../hooks/useUpdateData";
import useDeleteData from "./../../hooks/useDeleteData";

//get All Users
export const getAllUsers = () => async (dispatch) => {
  try {
    const response = await useGetDataToken("/users/users");

    dispatch({
      type: GET_ALL_USERS,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ALL_USERS,
      payload: e.response,
    });
  }
};

//create new user
export const createNewUser = (data) => async (dispatch) => {
  try {
    const response = await useInsertData(`/users/createUser`, data);
    dispatch({
      type: CREATE_NEW_USER,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: CREATE_NEW_USER,
      payload: e.response,
    });
  }
};

// get one user
export const getOneUser = (id) => async (dispatch) => {
  try {
    const response = await useGetDataToken(`/users/getUser/${id}`);

    dispatch({
      type: GET_ONE_USER,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ONE_USER,
      payload: e.response,
    });
  }
};
// update user
export const updateUser = (id, body) => async (dispatch) => {
  try {
    const response = await useUpdateData(`/users/updateUser/${id}`, body);

    dispatch({
      type: UPDATE_USER,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_USER,
      payload: e.response,
    });
  }
};
//delete User with id
export const deleteUser = (id) => async (dispatch) => {
  try {
    const response = await useDeleteData(`/users/deleteUser/${id}`);

    dispatch({
      type: DELETE_USER,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: DELETE_USER,
      payload: e.response,
    });
  }
};
