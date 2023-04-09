import React from "react";
import { ToastContainer } from "react-toastify";
import LoginCompoment from "./../../Components/Auth/LoginCompoment";
const LoginPage = () => {
  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center ">SKY LINK</h3>
      <div className="login-card">
        <LoginCompoment />
      </div>
      <ToastContainer autoClose={false} />
    </div>
  );
};

export default LoginPage;
