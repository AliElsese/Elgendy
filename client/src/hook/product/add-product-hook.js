import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import notify from "../useNotifaction";
import { createNewProduct } from "../../Redux/actions/productAction";

const AddProductHook = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isPress, setIsPress] = useState(false);

  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productPackage, setProductPackage] = useState("");
  const [consumerPrice, setConsumerPrice] = useState("");

  const onChangeProductName = (e) => {
    e.persist();
    setProductName(e.target.value);
  };

  const onChangeProductCode = (e) => {
    e.persist();
    setProductCode(e.target.value);
  };
  const onChangeProductPackage = (e) => {
    e.persist();
    setProductPackage(e.target.value);
  };
  const onChangeConsumerPrice = (e) => {
    e.persist();
    setConsumerPrice(e.target.value);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    setIsPress(true);
    setLoading(true);
    await dispatch(
      createNewProduct({
        proCode: productCode,
        proName: productName,
        proPackaging: productPackage,
        proPrice: consumerPrice,
      })
    );
    setLoading(false);
  };
  const res = useSelector((state) => state.productReducer.createProduct);
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
      }
      if (res.status === 201) {
        notify("تمت الاضافة بنجاح", "success");
        setTimeout(() => window.location.reload(false), 1000);
      }
    }
  }, [loading]);
  return [
    productName,
    productCode,
    productPackage,
    consumerPrice,

    onChangeProductName,
    onChangeProductCode,
    onChangeProductPackage,
    onChangeConsumerPrice,

    handelSubmit,
    loading,
    isPress,
  ];
};

export default AddProductHook;
