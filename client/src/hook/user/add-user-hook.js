import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewUser } from "../../Redux/actions/userAction";

import notify from "../useNotifaction";

const AddUserHook = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [isChecked, setIsChecked] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isPress, setIsPress] = useState(false);

  const onChangeName = (e) => {
    e.persist();
    setName(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const onChangeIsActive = () => {
    setIsChecked((prev) => !prev);
  };

  const validationValues = () => {
    if (name === "") {
      notify("اسم المستخدم مطلوب", "error");
      return;
    }

    if (password === "") {
      notify("كلمه المرور مطلوبة", "error");
      return;
    }
  };

  const onSubmit = async () => {
    validationValues();
    setIsPress(true);
    setLoading(true);

    await dispatch(
      createNewUser({
        username: name,
        password: password,
        isActive: `${isChecked}`,
      })
    );

    setLoading(false);
  };
  const res = useSelector((state) => state.userReducer.createUser);

  useEffect(() => {
    if (loading === false) {
      setLoading(true);
      setTimeout(() => setIsPress(false), 1000);
      if (res) {
        if (
          res.data.errors &&
          res.data.errors[0].msg === "يجب ان لا تقل كلمة السر عن 6 احرف"
        ) {
          notify("يجب ان تتكون كلمة المرور من  6 حروف او اكثر", "error");
        }
        if (res.status && res.status === 201) {
          notify("تمت اضافة المستخدم بنجاح", "success");
          // setTimeout(() => {
          //   window.location.reload(false);
          // }, 1000);
          setName("");
          setPassword("");
          // setIsActive(true);
        }
      }
    }
  }, [loading]);

  return [
    name,
    onChangeName,
    password,
    onChangePassword,
    isChecked,
    onChangeIsActive,
    onSubmit,
    loading,
    isPress,
  ];
};

export default AddUserHook;
