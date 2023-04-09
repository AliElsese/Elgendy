import React from "react";
import LoginHook from "./../../hook/auth/login-hook";

import { Spinner } from "react-bootstrap";
const LoginCompoment = () => {
  const [
    username,
    password,
    onChangeUsername,
    onChangePassword,
    onSubmit,
    loading,
    isPress,
  ] = LoginHook();

  return (
    <div className="form-content p-5">
      <h5>تسجيل الدخول</h5>
      <form onSubmit={onSubmit}>
        <div className="mt-5">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="name"
              value={username}
              onChange={onChangeUsername}
              placeholder="الاسم"
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={onChangePassword}
              placeholder="الباسورد"
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4">
            تسجيل الدخول
          </button>
        </div>
      </form>
      {isPress ? (
        loading === true ? (
          <Spinner animation="border" role="status" className="mt-4"></Spinner>
        ) : null
      ) : null}
    </div>
  );
};

export default LoginCompoment;
