import React from "react";
import ActiveCodeHook from "./../../hook/auth/active-code-hook";

import { ToastContainer } from "react-toastify";

const ActivationCodePage = () => {
  const [activeCode, onChangeActiveCode, onSubmit, loading] = ActiveCodeHook();
  return (
    <div className="container my-5">
      <div className="login-card">
        <div className="form-content p-5">
          <h5> ادخل كود التفعيل </h5>
          <form onSubmit={onSubmit} className="mt-5">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="activeCode"
                value={activeCode}
                onChange={onChangeActiveCode}
                placeholder="كود التفعيل"
              />
            </div>

            <button type="submit" className="btn btn-primary mt-4">
              تأكيد
            </button>
          </form>
        </div>
      </div>
      <ToastContainer autoClose={false} />
    </div>
  );
};

export default ActivationCodePage;
