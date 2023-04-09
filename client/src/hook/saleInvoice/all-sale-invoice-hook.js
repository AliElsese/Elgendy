import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import notify from "../useNotifaction";
import {
  getAllSaleInvoice,
  printSaleInvoice,
} from "../../Redux/actions/saleInvoiceAction";

const AllSaleInvoiceHook = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllSaleInvoice());
    setLoading(false);
  }, []);
  const allSaleInvoiceRes = useSelector(
    (state) => state.saleInvoiceReducer.allSaleInvoice
  );

  let allSaleInvoice = [];

  try {
    if (allSaleInvoiceRes.data) allSaleInvoice = allSaleInvoiceRes.data;
    else allSaleInvoice = [];
  } catch (e) {}

  //print
  const [loadingPrint, setLoadingPrint] = useState(true);
  const [isPress, setIsPress] = useState(false);
  const handlePrint = async (e) => {
    e.preventDefault();
    setLoadingPrint(true);
    setIsPress(true);
    await dispatch(printSaleInvoice());
    setLoadingPrint(false);
  };
  const res = useSelector((state) => state.saleInvoiceReducer.printSaleInvoice);
  useEffect(() => {
    if (loadingPrint === false) {
      setLoadingPrint(true);
      setTimeout(() => setIsPress(false), 1000);

      if (res) {
        if (res.status === 200) {
          notify("تم تجهيز التقرير بنجاح", "success");
        } else {
          notify("هناك مشكلة فى تجهيز التقرير ", "error");
        }
      }
    }
  }, [loadingPrint]);
  return [allSaleInvoice, handlePrint, isPress];
};

export default AllSaleInvoiceHook;
