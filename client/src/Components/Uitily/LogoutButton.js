import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  return (
    <>
      <button className="btn logout-btn" onClick={logOut}>
        تسجيل الخروج
      </button>
    </>
  );
};

export default LogoutButton;
