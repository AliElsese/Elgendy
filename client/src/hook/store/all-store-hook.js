import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import notify from "../useNotifaction";
import { getAllStore, printStore } from "../../Redux/actions/storeAction";

const AllStoreHook = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllStore());
    setLoading(false);
  }, []);
  const allStoreRes = useSelector((state) => state.storeReducer.allStore);

  let allStore = [];

  try {
    if (allStoreRes.data) allStore = allStoreRes.data;
    else allStore = [];
  } catch (e) {}

  //print
  const [loadingPrint, setLoadingPrint] = useState(true);
  const [isPress, setIsPress] = useState(false);

  const handlePrint = async (e) => {
    e.preventDefault();
    setIsPress(true);
    setLoadingPrint(true);
    await dispatch(printStore());
    setLoadingPrint(false);
  };
  const res = useSelector((state) => state.storeReducer.printStore);
  useEffect(() => {
    if (loadingPrint === false) {
      setLoadingPrint(true);
      setTimeout(() => setIsPress(false), 1000);

      if (res) {
        if (res.status === 200) {
          notify("تم تجهيز البيان بنجاح", "success");
        } else {
          notify("هناك مشكلة فى تجهيز البيان ", "error");
        }
      }
    }
  }, [loadingPrint]);
  return [allStore, handlePrint, isPress];
};

export default AllStoreHook;
