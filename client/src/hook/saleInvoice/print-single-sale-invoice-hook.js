import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import notify from "../useNotifaction";
import { printOneSaleInvoice } from "../../Redux/actions/saleInvoiceAction";
const PrintSingleSaleInvoiceHook = (id) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const [isPress, setIsPress] = useState(false);
  const res = useSelector(
    (state) => state.saleInvoiceReducer.printOneSaleInvoice
  );

  const handelPrint = async (e) => {
    e.preventDefault();

    setLoading(true);
    setIsPress(true);

    await dispatch(
      printOneSaleInvoice({
        invoiceId: id,
      })
    );
    setLoading(false);
  };
  useEffect(() => {
    if (loading === false) {
      setLoading(true);
      setTimeout(() => setIsPress(false), 1000);
      if (res) {
        if (res.status === 200) {
          notify(`تم تجهيز التقرير بنجاح`, "success");
          notify(`${res.data.data}`, "success");
        } else {
          notify("هناك مشكلة فى تجهيز التقرير ", "error");
        }
      }
    }
  }, [loading]);

  return [handelPrint, isPress];
};

export default PrintSingleSaleInvoiceHook;
