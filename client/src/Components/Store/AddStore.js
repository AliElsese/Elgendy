import React, { useState } from "react";
import PageTitle from "../Uitily/PageTitle";
import AddStoreHook from "../../hook/store/add-store-hook";
import { ToastContainer } from "react-toastify";
import { Spinner } from "react-bootstrap";

const AddStore = () => {
  const [
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
  ] = AddStoreHook();

  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle title="اضافة صنف الى المخزن" />
        <div className="card ">
          <div className="card-body m-3">
            <div className="row mb-3">
              <label
                htmlFor="productCode"
                className="col-sm-3 col-lg-2  col-form-label">
                كود الصنف
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  id="productCode"
                  placeholder="كود الصنف"
                  value={proCode}
                  onChange={onChangeProdCode}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="prodName"
                className="col-sm-3 col-lg-2  col-form-label">
                اسم الصنف
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  id="prodName"
                  placeholder="اسم الصنف"
                  value={proName}
                  onChange={onChangeProName}
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
                htmlFor="proCost"
                className="col-sm-3 col-lg-2  col-form-label">
                السعر
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="number"
                  className="form-control"
                  id="proCost"
                  placeholder="السعر"
                  value={proCost}
                  onChange={onChangeProCost}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="proQuantity"
                className="col-sm-3 col-lg-2  col-form-label">
                كمية الصنف
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="number"
                  className="form-control"
                  id="proQuantity"
                  placeholder="كمية الصنف"
                  value={proQuantity}
                  onChange={onChangeProQuantity}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label
                htmlFor="proTaxRate"
                className="col-sm-3 col-lg-2  col-form-label">
                نسبة الضريبة
              </label>
              <div className="col-sm-9 col-lg-10 ">
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="proTaxRate"
                    placeholder="نسبة الضريبة "
                    value={proTaxRate}
                    onChange={onChangeProTaxRate}
                  />
                  <span className="input-group-text" id="basic-addon2">
                    %
                  </span>
                </div>
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
          loading ? (
            <Spinner animation="border" className="mt-5" variant="primary" />
          ) : null
        ) : null}
      </div>
      <ToastContainer autoClose={false} />
    </div>
  );
};

export default AddStore;
