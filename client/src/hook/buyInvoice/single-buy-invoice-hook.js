import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOneBuyInvoice } from "../../Redux/actions/buyInvoiceAction";

const SingleBuyInvoiceHook = (id) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const get = async () => {
      setLoading(true);
      await dispatch(getOneBuyInvoice(id));
      setLoading(false);
    };
    get();
  }, []);
  //get one BuyInvoice details
  const item = useSelector((state) => state.buyInvoiceReducer.oneBuyInvoice);

  const [buyInvoice, setBuyInvoice] = useState([]);

  useEffect(() => {
    if (loading === false) {
      if (item && item.data) {
        setBuyInvoice(item.data);
      }
    }
  }, [loading]);

  return [buyInvoice];
};

export default SingleBuyInvoiceHook;
