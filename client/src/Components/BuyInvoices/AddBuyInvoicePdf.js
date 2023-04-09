import React from "react";
import PageTitle from "./../Uitily/PageTitle";
import AddPdfBuyInvoiceHook from "./../../hook/buyInvoice/add-pdf-buy-invoice-hook";
import { Spinner } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

const AddBuyInvoicePdf = () => {
  const [handelSave, onFileChange, isPress] = AddPdfBuyInvoiceHook();
  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle title="اضافة فاتورة شراء pdf" />
        <div className="card ">
          <div className="card-body m-3">
            <div className="row mb-3">
              <label className="col-sm-3 col-lg-2 col-form-label">
                ملف الpdf
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="file"
                  accept=".pdf"
                  id="chooseFile"
                  onChange={onFileChange}
                />
              </div>
            </div>
            <button
              onClick={handelSave}
              className="btn btn-primary mt-2 btn-custom">
              حفظ
            </button>
          </div>
        </div>
        {isPress ? (
          <Spinner animation="border" className="mt-5" variant="primary" />
        ) : null}
      </div>
      <ToastContainer autoClose={false} />
    </div>
  );
};

export default AddBuyInvoicePdf;
