import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import notify from "../useNotifaction";

import { deleteSaleInvoice } from "../../Redux/actions/saleInvoiceAction";

const DeleteSaleInvoiceHook = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setShow(true);
    setId(id);
  };
  const handelDelete = async () => {
    setLoading(true);
    await dispatch(deleteSaleInvoice(id));

    setLoading(false);
    setShow(false);
  };
  const res = useSelector(
    (state) => state.saleInvoiceReducer.deleteSaleInvoice
  );
  useEffect(() => {
    if (loading === false) {
      if (res === "") {
        notify("تم حذف الفاتورة بنجاح", "success");

        window.location.reload(false);
      } else notify("هناك مشكله فى عملية المسح", "error");
    }
  }, [loading]);
  return [show, handleClose, handleShow, handelDelete];
};

export default DeleteSaleInvoiceHook;
