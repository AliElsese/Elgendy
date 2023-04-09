import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOneUser, updateUser } from "./../../Redux/actions/userAction";
import notify from "../useNotifaction";
import { useNavigate } from "react-router-dom";

const EditUserHook = (id) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState(true);
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await dispatch(getOneUser(id));
      setLoading(false);
    };
    run();
  }, []);
  //get one user details
  const item = useSelector((state) => state.userReducer.oneUser);

  const [isPress, setIsPress] = useState(false);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (loading === false) {
      if (item) {
        if (item.data) {
          setName(item.data.username);
          setPassword(item.data.password);
          setIsActive(item.data.isActive);
        }
      }
    }
  }, [loading]);

  const onChangeName = (e) => {
    e.persist();
    setName(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const onChangeIsActive = () => {
    setIsActive(!isActive);
  };

  const res = useSelector((state) => state.userReducer.updateUser);

  const onSubmit = async () => {
    setLoadingEdit(true);

    await dispatch(
      updateUser(id, {
        username: name,
        password: password,
        isActive: `${isActive}`,
      })
    );
    setIsPress(true);
    setLoadingEdit(false);
  };
  useEffect(() => {
    if (loadingEdit === false) {
      setLoadingEdit(true);
      setTimeout(() => setIsPress(false), 1000);
      if (res) {
        if (res.data.errors) {
          res.data.errors.map((error) => {
            if (error.msg) {
              notify(`${error.msg}`, "error");
            }
          });
        }
      }
      if (res && res.status === 200) {
        notify("تم التعديل بنجاح", "success");

        setTimeout(() => {
          navigate("/users");
        }, 1000);
      }
    }
  }, [loadingEdit]);

  return [
    name,
    onChangeName,
    password,
    onChangePassword,
    isActive,
    onChangeIsActive,
    onSubmit,
    loading,
    isPress,
  ];
};

export default EditUserHook;
