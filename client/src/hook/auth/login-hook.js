import React, { useState, useEffect } from "react";
import notify from "./../useNotifaction";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginAuth } from "./../../Redux/actions/authAction";

const LoginHook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPress, setIsPress] = useState(false);

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsPress(true);
    setLoading(true);

    await dispatch(
      loginAuth({
        username,
        password,
      })
    );
    setIsPress(false);
    setLoading(false);
  };

  const res = useSelector((state) => state.authReducer.loginUser);
  useEffect(() => {
    if (loading === false) {
      if (res) {
        if (res.data.errors) {
          res.data.errors.map((error) => {
            if (error.msg) {
              notify(`${error.msg}`, "error");
            }
          });
        }
        if (res.status === 200) {
          if (!res.data.token) {
            if (res.data.data)
              localStorage.setItem("user", JSON.stringify(res.data.data));
            navigate("/activecode");
          }
        }

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.data));
          notify("تم تسجيل الدخول بنجاح", "success");
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }

        if (res.data.message === "المستخدم او كلمة السر خطأ") {
          notify("كلمة السر أو الاسم خطأ", "error");
        }

        setLoading(true);
      }
    }
  }, [loading]);
  return [
    username,
    password,
    onChangeUsername,
    onChangePassword,
    onSubmit,
    loading,
    isPress,
  ];
};

export default LoginHook;
