import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../Uitily/PageTitle";
import EditProductHook from "../../hook/product/edit-product-hook";
import { ToastContainer } from "react-toastify";
import { Spinner } from "react-bootstrap";

const EditProduct = () => {
  const { id } = useParams();
  const [
    productName,
    productPackage,
    consumerPrice,
    onChangeProductName,
    onChangeProductPackage,
    onChangeConsumerPrice,
    handelSubmit,
    loadingEdit,
    isPress,
  ] = EditProductHook(id);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle title="تعديل صنف" />
        <div className="card ">
          <div className="card-body m-3">
            <div className="row mb-3">
              <label
                htmlFor="productName"
                className="col-sm-3 col-lg-2 col-form-label">
                اسم الصنف
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  id="productName"
                  placeholder="اسم الصنف"
                  value={productName}
                  onChange={onChangeProductName}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label
                htmlFor="productPackage"
                className="col-sm-3 col-lg-2  col-form-label">
                العبوة
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  id="productPackage"
                  placeholder="العبوة"
                  value={productPackage}
                  onChange={onChangeProductPackage}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="consumerPrice"
                className="col-sm-3 col-lg-2  col-form-label">
                السعر
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  id="consumerPrice"
                  placeholder="السعر "
                  value={consumerPrice}
                  onChange={onChangeConsumerPrice}
                />
              </div>
            </div>

            <button
              onClick={handelSubmit}
              className="btn btn-primary mt-2 btn-custom">
              حفظ
            </button>
          </div>
        </div>
        {isPress ? (
          loadingEdit ? (
            <Spinner animation="border" className="mt-5" variant="primary" />
          ) : null
        ) : null}
      </div>
      <ToastContainer autoClose={false} />
    </div>
  );
};

export default EditProduct;
