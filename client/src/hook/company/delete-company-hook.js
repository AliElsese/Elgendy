import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import notify from "../../hook/useNotifaction";
import { deleteCompany } from "../../Redux/actions/companyAction";

const DeleteCompanyHook = () => {
  const dispatch = useDispatch();
  const [id, setId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setShow(true);
    setId(id);
  };
  const handelDelete = async () => {
    setLoading(true);

    await dispatch(deleteCompany(id));

    setLoading(false);
    setShow(false);
  };
  const res = useSelector((state) => state.companyReducer.deleteCompany);
  useEffect(() => {
    if (loading === false) {
      if (res === "") {
        notify("تم حذف الشركة بنجاح", "success");

        window.location.reload(false);
      } else notify("هناك مشكله فى عملية المسح", "error");
    }
  }, [loading]);
  return [show, handleClose, handleShow, handelDelete, loading];
};

export default DeleteCompanyHook;
