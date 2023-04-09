import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import notify from "../useNotifaction";
import { getOneStore, updateStore } from "../../Redux/actions/storeAction";

const EditStoreHoook = (id) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState(true);
  const [isPress, setIsPress] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await dispatch(getOneStore(id));
      setLoading(false);
    };
    run();
  }, []);
  //get one store details
  const item = useSelector((state) => state.storeReducer.oneStore);

  const [proQuantity, setProQuantity] = useState("");
  const [proPrice, setProPrice] = useState("");
  const [proTaxRate, setProTaxRate] = useState("");

  useEffect(() => {
    if (loading === false) {
      if (item) {
        if (item.data) {
          setProQuantity(item.data.proQuantity);
          setProPrice(item.data.proPrice);
          setProTaxRate(item.data.proTaxRate);
        }
      }
    }
  }, [loading]);

  const onChangeProQuantity = (e) => {
    e.persist();
    setProQuantity(e.target.value);
  };
  const onChangeProPrice = (e) => {
    e.persist();
    setProPrice(e.target.value);
  };
  const onChangeProTaxRate = (e) => {
    e.persist();
    setProTaxRate(e.target.value);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    setIsPress(true);
    setLoadingEdit(true);
    await dispatch(
      updateStore(id, {
        proPrice,
        proQuantity,
        proTaxRate,
      })
    );
    setLoadingEdit(false);
  };
  const res = useSelector((state) => state.storeReducer.updateStore);
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
      if (res.status === 200) {
        notify("تم التعديل بنجاح", "success");
        setTimeout(() => {
          navigate("/store");
        }, 1000);
      }
    }
  }, [loadingEdit]);
  return [
    proQuantity,
    onChangeProQuantity,
    proPrice,
    proTaxRate,
    onChangeProPrice,
    onChangeProTaxRate,
    handelSubmit,
    loadingEdit,
    isPress,
  ];
};

export default EditStoreHoook;
