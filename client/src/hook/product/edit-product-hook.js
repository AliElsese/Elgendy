import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import notify from "../useNotifaction";
import {
  getOneProduct,
  updateProduct,
} from "../../Redux/actions/productAction";

const EditParoductHook = (id) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState(true);
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await dispatch(getOneProduct(id));
      setLoading(false);
    };
    run();
  }, []);
  //get one product details
  const item = useSelector((state) => state.productReducer.oneProduct);

  const [isPress, setIsPress] = useState(false);

  const [productName, setProductName] = useState("");
  const [productPackage, setProductPackage] = useState("");
  const [consumerPrice, setConsumerPrice] = useState("");

  useEffect(() => {
    if (loading === false) {
      if (item) {
        if (item.data) {
          setProductName(item.data.proName);
          setProductPackage(item.data.proPackaging);
          setConsumerPrice(item.data.proPrice);
        }
      }
    }
  }, [loading]);
  const onChangeProductName = (e) => {
    e.persist();
    setProductName(e.target.value);
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
    setLoadingEdit(true);
    await dispatch(
      updateProduct(id, {
        proName: productName,
        proPackaging: productPackage,
        proPrice: consumerPrice,
      })
    );
    setLoadingEdit(false);
  };
  const res = useSelector((state) => state.productReducer.updateProduct);
  useEffect(() => {
    if (loadingEdit === false) {
      setLoadingEdit(true);
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
      if (res && res.status === 200) {
        notify("تم التعديل بنجاح", "success");

        setTimeout(() => {
          navigate("/product");
        }, 1000);
      }
    }
  }, [loadingEdit]);
  return [
    productName,
    productPackage,
    consumerPrice,
    onChangeProductName,
    onChangeProductPackage,
    onChangeConsumerPrice,
    handelSubmit,
    loadingEdit,
    isPress,
  ];
};

export default EditParoductHook;
