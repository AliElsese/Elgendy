import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import notify from "./../useNotifaction";
import { createNewCompany } from "./../../Redux/actions/companyAction";

const AddCompanyHook = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isPress, setIsPress] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [companyScope, setCompanyScope] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyTaxNumber, setCompanyTaxNumber] = useState("");
  const [companyBranche, setCompanyBranche] = useState("");

  const onChangeCompanyName = (e) => {
    e.persist();
    setCompanyName(e.target.value);
  };
  const onChangeCompanyAddress = (e) => {
    e.persist();
    setCompanyAddress(e.target.value);
  };

  const onChangeCompanyScope = (e) => {
    e.persist();
    setCompanyScope(e.target.value);
  };
  const onChangeCompanyTaxNumber = (e) => {
    e.persist();
    setCompanyTaxNumber(e.target.value);
  };
  const onChangeCompanyBranche = (e) => {
    e.persist();
    setCompanyBranche(e.target.value);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    if (companyName === "") {
      notify("اسم الشركة مطلوب", "error");
      return;
    }
    if (companyScope === "") {
      notify("تخصص الشركة مطلوب", "error");
      return;
    }
    if (companyTaxNumber === "") {
      notify("رقم السجل الضريبى مطلوب", "error");
      return;
    }
    if (companyAddress === "") {
      notify("عنوان الشركة مطلوب", "error");
      return;
    }
    if (companyBranche === "") {
      notify("فرع الشركة مطلوب", "error");
      return;
    }

    setLoading(true);
    setIsPress(true);
    await dispatch(
      createNewCompany({
        companyName,
        companyScope,
        companyAddress,
        companyTaxNumber,
        companyBranche,
      })
    );
    setLoading(false);
  };
  const res = useSelector((state) => state.companyReducer.createCompany);
  useEffect(() => {
    if (loading === false) {
      setLoading(true);
      setTimeout(() => setIsPress(false), 1000);
      if (res) {
        if (res.status === 201) {
          notify("تمت الاضافة بنجاح", "success");
          setTimeout(() => window.location.reload(false), 1000);
        }
      }
    }
  }, [loading]);
  return [
    companyName,
    companyScope,
    companyTaxNumber,
    companyAddress,
    companyBranche,
    onChangeCompanyTaxNumber,
    onChangeCompanyAddress,
    onChangeCompanyBranche,
    onChangeCompanyName,
    onChangeCompanyScope,
    handelSubmit,
    loading,
    isPress,
  ];
};

export default AddCompanyHook;
