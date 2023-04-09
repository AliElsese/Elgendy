import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import notify from "./../../hook/useNotifaction";
import { createNewPdfBuyInvoice } from "../../Redux/actions/buyInvoiceAction";
const AddPdfBuyInvoiceHook = () => {
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPress, setIsPress] = useState(false);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const res = useSelector(
    (state) => state.buyInvoiceReducer.createPdfBuyInvoice
  );
  //Save data in database
  const handelSave = async (e) => {
    e.preventDefault();

    if (selectedFile === "") {
      notify("اضف الملف ", "error");
    }

    const formData = new FormData();
    formData.append("invoiceFile", selectedFile);
    setLoading(true);
    setIsPress(true);

    await dispatch(createNewPdfBuyInvoice(formData));
    setLoading(false);
  };
  useEffect(() => {
    if (loading === false) {
      setLoading(true);
      setTimeout(() => setIsPress(false), 1000);
      if (res) {
        if (res.status === 400) {
          notify(res.data.message, "error");
        }

        if (res.data.errors && res.data.errors.invoiceNumber) {
          notify("  اضف رقم الفاتورة ", "error");
        }
        if (res.status === 201) {
          notify("تمت عملية الاضافة بنجاح", "success");
          setTimeout(() => window.location.reload(false), 1000);
        }
      }
    }
  }, [loading]);

  return [handelSave, onFileChange, isPress];
};

export default AddPdfBuyInvoiceHook;
