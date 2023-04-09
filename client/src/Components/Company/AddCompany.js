import React from "react";
import PageTitle from "./../Uitily/PageTitle";
import { ToastContainer } from "react-toastify";
import { Spinner } from "react-bootstrap";
import AddCompanyHook from "../../hook/company/add-company-hook";
const AddCompany = () => {
  const [
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
  ] = AddCompanyHook();
  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle title="اضافة شركة" />
        <div className="card ">
          <div className="card-body m-3">
            <div className="row mb-3">
              <label
                htmlFor="companyName"
                className="col-sm-3 col-lg-2  col-form-label">
                اسم الشركة
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  id="companyName"
                  placeholder="اسم الشركة"
                  value={companyName}
                  onChange={onChangeCompanyName}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="companyScope"
                className="col-sm-3 col-lg-2 col-form-label">
                تخصص الشركة
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  id="companyScope"
                  placeholder="تخصص الشركة"
                  value={companyScope}
                  onChange={onChangeCompanyScope}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label
                htmlFor="companyTaxNumber"
                className="col-sm-3 col-lg-2  col-form-label">
                رقم السجل الضريبى
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  id="companyTaxNumber"
                  placeholder="رقم السجل الضريبى"
                  value={companyTaxNumber}
                  onChange={onChangeCompanyTaxNumber}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="companyAddress"
                className="col-sm-3 col-lg-2  col-form-label">
                عنوان الشركة
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  id="companyAddress"
                  placeholder="عنوان الشركة"
                  value={companyAddress}
                  onChange={onChangeCompanyAddress}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="companyBranche"
                className="col-sm-3 col-lg-2  col-form-label">
                فرع الشركة
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  id="companyBranche"
                  placeholder="فرع الشركة"
                  value={companyBranche}
                  onChange={onChangeCompanyBranche}
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
          loading ? (
            <Spinner animation="border" className="mt-5" variant="primary" />
          ) : null
        ) : null}
      </div>
      <ToastContainer autoClose={false} />
    </div>
  );
};

export default AddCompany;
