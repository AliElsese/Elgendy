import React from "react";
import AddUserHook from "./../../hook/user/add-user-hook";
import { ToastContainer } from "react-toastify";
import { Spinner } from "react-bootstrap";
import PageTitle from "./../Uitily/PageTitle";

const AddUser = () => {
  const [
    name,
    onChangeName,
    password,
    onChangePassword,
    isChecked,
    onChangeIsActive,
    onSubmit,
    loading,
    isPress,
  ] = AddUserHook();
  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle title="اضافة مستخدم" />
        <div className="card ">
          <div className="card-body m-3">
            <div className="row mb-3">
              <label
                htmlFor="name"
                className="col-sm-3 col-lg-2  col-form-label">
                اسم المستخدم
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="اسم المستخدم"
                  value={name}
                  onChange={onChangeName}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="password"
                className="col-sm-3 col-lg-2 col-form-label">
                كلمة المرور
              </label>
              <div className="col-sm-9 col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  id="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={onChangePassword}
                />
              </div>
            </div>

            <div className="row mb-3 ">
              <label htmlFor="" className="col-3 col-lg-2  col-form-label">
                الحالة
              </label>
              <div className="col-9 col-lg-10 ">
                <div className="form-check mt-2 form-switch d-flex">
                  <label htmlFor="active" className="form-label">
                    نشط
                  </label>
                  <input
                    className="form-check-input me-3"
                    id="active"
                    type="checkbox"
                    checked={isChecked}
                    onChange={onChangeIsActive}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={onSubmit}
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
      <ToastContainer />
    </div>
  );
};

export default AddUser;
