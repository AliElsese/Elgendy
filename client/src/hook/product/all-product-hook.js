import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import notify from "../useNotifaction";
import {
  getAllProduct,
  printAllProduct,
} from "../../Redux/actions/productAction";

const AllProductHook = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [loadingPrint, setLoadingPrint] = useState(true);
  const [isPress, setIsPress] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllProduct());
    setLoading(false);
  }, []);
  const allProductRes = useSelector((state) => state.productReducer.allProduct);

  let allProduct = [];

  try {
    if (allProductRes.data) allProduct = allProductRes.data;
    else allProduct = [];
  } catch (e) {}

  //print products
  const handlePrint = async (e) => {
    e.preventDefault();
    setLoadingPrint(true);
    setIsPress(true);
    await dispatch(printAllProduct());
    setLoadingPrint(false);
  };
  const res = useSelector((state) => state.productReducer.printProduct);
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
  return [allProduct, handlePrint, isPress];
};

export default AllProductHook;
