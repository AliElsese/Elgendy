import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllBuyInvoice,
  printBuyInvoice,
} from "./../../Redux/actions/buyInvoiceAction";
import notify from "./../useNotifaction";

const AllBuyInvoiceHook = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllBuyInvoice());
    setLoading(false);
  }, []);
  const allBuyInvoiceRes = useSelector(
    (state) => state.buyInvoiceReducer.allBuyInvoice
  );

  let allBuyInvoice = [];

  try {
    if (allBuyInvoiceRes.data) allBuyInvoice = allBuyInvoiceRes.data;
    else allBuyInvoice = [];
  } catch (e) {}

  //print
  const [loadingPrint, setLoadingPrint] = useState(true);
  const [isPress, setIsPress] = useState(false);
  const handlePrint = async (e) => {
    e.preventDefault();
    setLoadingPrint(true);
    setIsPress(true);
    await dispatch(printBuyInvoice());
    setLoadingPrint(false);
  };
  const res = useSelector((state) => state.buyInvoiceReducer.printBuyInvoice);
  useEffect(() => {
    if (loadingPrint === false) {
      setLoadingPrint(true);
      setTimeout(() => setIsPress(false), 1000);

      if (res) {
    
        if (res.data.status === "success") {
          notify(res.data.message, "success");
        } else {
          notify("هناك مشكلة فى تجهيز التقرير ", "error");
        }
      }
    }
  }, [loadingPrint]);
  return [allBuyInvoice, handlePrint, isPress];
};

export default AllBuyInvoiceHook;
