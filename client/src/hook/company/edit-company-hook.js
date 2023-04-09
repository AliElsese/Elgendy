import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import avtarImg from "../../images/avatar.png";
import notify from "./../useNotifaction";
import { useNavigate } from "react-router-dom";
import {
  getOneCompany,
  updateCompany,
} from "./../../Redux/actions/companyAction";

const EditComapnyHook = (id) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState(true);
  const [isPress, setIsPress] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await dispatch(getOneCompany(id));
      setLoading(false);
    };
    run();
  }, []);
  //get one company details
  const item = useSelector((state) => state.companyReducer.oneCompany);

  const [companyName, setCompanyName] = useState("");
  const [companyScope, setCompanyScope] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyTaxNumber, setCompanyTaxNumber] = useState("");
  const [companyBranche, setCompanyBranche] = useState("");
  useEffect(() => {
    if (loading === false) {
      if (item) {
        if (item.data) {
          setCompanyName(item.data.companyName);
          setCompanyScope(item.data.companyScope);
          setCompanyAddress(item.data.companyAddress);
          setCompanyTaxNumber(item.data.companyTaxNumber);
          setCompanyBranche(item.data.companyBranche);
        }
      }
    }
  }, [loading]);
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

    setLoadingEdit(true);
    setIsPress(true);
    await dispatch(
      updateCompany(id, {
        companyName,
        companyScope,
        companyAddress,
        companyTaxNumber,
        companyBranche,
      })
    );
    setLoadingEdit(false);
  };
  const res = useSelector((state) => state.companyReducer.updateCompany);
  useEffect(() => {
    if (loadingEdit === false) {
      setLoadingEdit(true);
      setTimeout(() => setIsPress(false), 1000);
      if (res) {
        if (res.status === 200) {
          notify("تم التعديل بنجاح", "success");

          setTimeout(() => {
            navigate("/company");
          }, 1000);
        }
      }
    }
  }, [loadingEdit]);
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

export default EditComapnyHook;
