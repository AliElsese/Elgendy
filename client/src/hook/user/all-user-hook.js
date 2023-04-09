import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "./../../Redux/actions/userAction";

const AllUsersHook = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const get = async () => {
      setLoading(true);
      await dispatch(getAllUsers());
      setLoading(false);
    };
    get();
  }, []);
  const resUsers = useSelector((state) => state.userReducer.allUsers);

  let users = [];

  try {
    if (resUsers && resUsers.data) users = resUsers.data;
    else users = [];
  } catch (e) {}

  return [users];
};

export default AllUsersHook;
