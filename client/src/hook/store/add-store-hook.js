import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import notify from "../useNotifaction";
import { createNewStore } from "../../Redux/actions/storeAction";

import axios from "axios";
const AddStoreHook = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isPress, setIsPress] = useState(false);

  const [proCode, setProCode] = useState("");
  const [proQuantity, setProQuantity] = useState("");
  const [proCost, setProCost] = useState("");
  const [proName, setProName] = useState("");
  const [proTaxRate, setProTaxRate] = useState("");
  const [productPackage, setProductPackage] = useState("");

  const onChangeProdCode = (e) => {
    e.persist();
    setProCode(e.target.value);
  };
  const fetchData = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    if (proCode !== "") {
      await axios
        .post(
          "http://localhost:8101/products/getProductCode",
          { proCode: `${proCode}` },
          config
        )
        .then((res) => {
          setProName(res.data.data.proName);
          setProCost(res.data.data.proPrice);
          setProductPackage(res.data.data.proPackaging);
        })
        .catch((err) => {
          setProName("");
          setProCost("");
          setProductPackage("");
          if (err.response) {
            err.response.data.errors.map((error) => {
              if (error.msg) {
                notify(`${error.msg}`, "error");
              }
            });
          }
        });
    } else {
      setProName("");
      setProCost("");
      setProductPackage("");
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [proCode]);
  const onChangeProTaxRate = (e) => {
    e.persist();
    setProTaxRate(e.target.value);
  };
  const onChangeProQuantity = (e) => {
    e.persist();
    setProQuantity(e.target.value);
  };
  const onChangeProCost = (e) => {
    e.persist();
    setProCost(e.target.value);
  };
  const onChangeProName = (e) => {
    e.persist();
    setProName(e.target.value);
  };
  const onChangeProductPackage = (e) => {
    e.persist();
    setProductPackage(e.target.value);
  };
  const handelSubmit = async (e) => {
    e.preventDefault();
    if (proCode === "") {
      notify("كود الصنف مطلوب", "error");
      return;
    }
    setIsPress(true);
    setLoading(true);
    await dispatch(
      createNewStore({
        proCode,
        proQuantity,
        proTaxRate,
      })
    );
    setLoading(false);
  };
  const res = useSelector((state) => state.storeReducer.createStore);
  useEffect(() => {
    if (loading === false) {
      setLoading(true);
      setTimeout(() => setIsPress(false), 1000);
      if (res) {
        if (res.data.errors) {
          res.data.errors.map((error) => {
            if (error.msg) {
              notify(`${error.msg}`, "error");
            }
          });
        }
        if (res.data.status === "error") {
          notify(`تم ادخال هذا الصنف من قبل`, "error");
        }
      }

      if (res.status === 201) {
        notify("تمت الاضافة بنجاح", "success");
        setTimeout(() => window.location.reload(false), 1000);
      }
    }
  }, [loading]);
  return [
    proCode,
    proQuantity,
    proCost,
    proName,
    proTaxRate,
    productPackage,
    onChangeProTaxRate,
    onChangeProdCode,
    onChangeProQuantity,
    onChangeProCost,
    onChangeProName,
    onChangeProductPackage,
    handelSubmit,
    loading,
    isPress,
  ];
};

export default AddStoreHook;
