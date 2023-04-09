import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../../Redux/actions/userAction";
import notify from "../useNotifaction";

const DeleteUserHook = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [id, setId] = useState("");

  const handleDeletClose = () => setShowDelete(false);
  const handleDeleteShow = (id) => {
    setShowDelete(true);
    setId(id);
  };

  const handelDelete = async () => {
    setLoading(true);
    await dispatch(deleteUser(id));
    setLoading(false);
    setShowDelete(false);
  };
  const res = useSelector((state) => state.userReducer.deleteUser);
  useEffect(() => {
    if (loading === false) {
      notify("تم حذف المستخدم بنجاح", "success");
      setTimeout(() => {
        window.location.reload(false);
      }, 1000);
    }
  }, [loading]);
  return [showDelete, handleDeletClose, handleDeleteShow, handelDelete];
};

export default DeleteUserHook;
