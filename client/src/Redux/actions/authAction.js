import { LOGIN_USER, ACTIVE_CODE } from "../type";
import { useInsertData } from "../../hooks/useInsertData";
//loginAuth
export const loginAuth = (data) => async (dispatch) => {
  try {
    const response = await useInsertData(`/auth/userlogin`, data);
    dispatch({
      type: LOGIN_USER,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: LOGIN_USER,
      payload: e.response,
    });
  }
};

export const activeCodeAuth = (data) => async (dispatch) => {
  try {
    const response = await useInsertData(`/auth/activationCode`, data);
    dispatch({
      type: ACTIVE_CODE,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: ACTIVE_CODE,
      payload: e.response,
    });
  }
};
