import React, { useState } from "react";
import PageTitle from "../Uitily/PageTitle";
import EditStoreHoook from "../../hook/store/edit-store-hook";
import { ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const AddStore = () => {
  const { id } = useParams();
  const [
    proQuantity,
    onChangeProQuantity,
    proPrice,
    proTaxRate,
    onChangeProPrice,
    onChangeProTaxRate,
    handelSubmit,
    loadingEdit,
    isPress,
  ] = EditStoreHoook(id);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle title="تعديل مخزن" />
        <div className="card ">
          <div className="card-body m-3">
            <div className="row mb-3">
              <label
                htmlFor="proPrice"
                className="col-sm-3 col-lg-2  col-form-label">
                السعر
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="number"
                  className="form-control"
                  id="proPrice"
                  placeholder=" السعر"
                  value={proPrice}
                  onChange={onChangeProPrice}
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
          loadingEdit ? (
            <Spinner animation="border" className="mt-5" variant="primary" />
          ) : null
        ) : null}
      </div>
      <ToastContainer autoClose={false} />
    </div>
  );
};

export default AddStore;
