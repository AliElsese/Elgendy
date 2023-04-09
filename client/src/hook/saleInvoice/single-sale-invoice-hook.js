import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOneSaleInvoice } from "../../Redux/actions/saleInvoiceAction";

const SingleSaleInvoiceHook = (id) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const get = async () => {
      setLoading(true);
      await dispatch(getOneSaleInvoice(id));
      setLoading(false);
    };
    get();
  }, []);
  //get one SaleInvoice details
  const item = useSelector((state) => state.saleInvoiceReducer.oneSaleInvoice);

  const [saleInvoice, setSaleInvoice] = useState([]);
  useEffect(() => {
    if (loading === false) {
      if (item && item.data) {
        setSaleInvoice(item.data);
      }
    }
  }, [loading]);

  return [saleInvoice];
};

export default SingleSaleInvoiceHook;
