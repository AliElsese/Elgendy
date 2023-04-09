import React, { useState, useEffect } from "react";
import notify from "./../useNotifaction";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { activeCodeAuth } from "./../../Redux/actions/authAction";

const ActiveCodeHook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeCode, setActiveCode] = useState("");

  const [loading, setLoading] = useState(true);

  let userID = "";
  if (localStorage.getItem("user") != null)
    userID = JSON.parse(localStorage.getItem("user"))._id;

  const onChangeActiveCode = (e) => {
    setActiveCode(e.target.value);
  };

  const validationValues = () => {
    if (activeCode === "") {
      notify("من فضلك  ادخل كود التفعيل ", "error");
      return;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    validationValues();
    await dispatch(
      activeCodeAuth({
        userId: userID,
        activationCode: activeCode,
      })
    );

    setLoading(false);
  };

  const res = useSelector((state) => state.authReducer.activeCode);
  useEffect(() => {
    if (loading === false) {
      if (res) {
        if (res.status === 401) {
          if (res.data.message === "كود التفعيل خطأ") {
            notify("كود التفعيل خطأ", "error");
          }
        }

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);

          notify("تم تسجيل الدخول بنجاح", "success");
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }

        setLoading(true);
      }
    }
  }, [loading]);
  return [activeCode, onChangeActiveCode, onSubmit, loading];
};

export default ActiveCodeHook;
