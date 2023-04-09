import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import LoginPage from "./Page/Auth/LoginPage";

import Navbar from "./Components/Uitily/Navbar";
import Sidebar from "./Components/Uitily/Sidebar";

import ManageProductPage from "./Page/Products/ManageProductsPage";
import EditProductPage from "./Page/Products/EditProductPage";
import AddProductPage from "./Page/Products/AddProductPage";
import BuyInvoicesDisplayPage from "./Page/BuyInvoices/BuyInvoicesDisplayPage";
import SingleBuyInvoicePage from "./Page/BuyInvoices/SingleBuyInvoicePage";
import AddBuyInvoicePage from "./Page/BuyInvoices/AddBuyInvoicePage";
import EditBuyInvoicePage from "./Page/BuyInvoices/EditBuyInvoicePage";
import ManageStorePage from "./Page/Store/ManageStorePage";
import AddStorePage from "./Page/Store/AddStorePage";
import EditStorePage from "./Page/Store/EditStorePage";

import ProtectedRoute from "./Components/Uitily/ProtectedRoute";

import Footer from "./Components/Uitily/Footer";
import SaleInvoicesDisplayPage from "./Page/SaleInvoices/SaleInvoicesDisplayPage";
import SingleSaleInvoicePage from "./Page/SaleInvoices/SingleSaleInvoicePage";
import AddSaleInvoicePage from "./Page/SaleInvoices/AddSaleInvoicePage";
import EditSaleInvoicePage from "./Page/SaleInvoices/EditSaleInvoicePage";
import NotFoundPage from "./Page/NotFoundPage";
import ActivationCodePage from "./Page/Auth/ActivationCodePage";
import HomePage from "./Page/HomePage";
import RecordsPage from "./Page/RecordsPage";
import AddBuyInvoicePdfPage from "./Page/BuyInvoices/AddBuyInvoicePdfPage";

import UsersDisplayPage from "./Page/Users/UsersDisplayPage";
import AddUserPage from "./Page/Users/AddUserPage";
import EditUserPage from "./Page/Users/EditUserPage";
import AllCompanyPage from "./Page/Company/AllCompanyPage";
import AddCompanyPage from "./Page/Company/AddCompanyPage";
import EditCompanyPage from "./Page/Company/EditCompanyPage";

function App() {
  const location = useLocation();

  const loggedIn =
    location.pathname !== "/" && location.pathname !== "/activecode"
      ? true
      : false;

  const home = location.pathname !== "/home" ? true : false;
  const records = location.pathname !== "/records" ? true : false;
  const [isHome, setIsHome] = useState(false);
  useEffect(() => {
    if (!home) {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
  }, [home]);

  const [isMenuActive, setIsMenuActive] = useState(false);
  const handleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const user = localStorage.getItem("token");
  const useAuth = () => {
    if (user) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {loggedIn && records && (
        <Navbar
          isHome={isHome}
          isMenuActive={isMenuActive}
          handleMenu={handleMenu}
        />
      )}
      {loggedIn && home && records && <Sidebar isMenuActive={isMenuActive} />}

      <Routes>
        {user ? (
          <Route index element={<Navigate to="/home" />} />
        ) : (
          <Route index element={<LoginPage />} />
        )}

        <Route path="/activecode" element={<ActivationCodePage />} />

        <Route element={<ProtectedRoute auth={useAuth()} />}>
          <Route path="/home" element={<HomePage />} />

          <Route path="/product" element={<ManageProductPage />} />
          <Route path="/addproduct" element={<AddProductPage />} />
          <Route path="/editproduct/:id" element={<EditProductPage />} />

          <Route path="/users" element={<UsersDisplayPage />} />
          <Route path="/adduser" element={<AddUserPage />} />
          <Route path="/edituser/:id" element={<EditUserPage />} />

          <Route path="/company" element={<AllCompanyPage />} />
          <Route path="/addcompany" element={<AddCompanyPage />} />
          <Route path="/editcompany/:id" element={<EditCompanyPage />} />

          <Route path="/buyinvoice" element={<BuyInvoicesDisplayPage />} />
          <Route path="/buyinvoice/:id" element={<SingleBuyInvoicePage />} />
          <Route path="/addbuyinvoice" element={<AddBuyInvoicePage />} />
          <Route path="/addbuyinvoicepdf" element={<AddBuyInvoicePdfPage />} />
          <Route path="/editbuyinvoice/:id" element={<EditBuyInvoicePage />} />

          <Route path="/store" element={<ManageStorePage />} />
          <Route path="/addstore" element={<AddStorePage />} />
          <Route path="/editstore/:id" element={<EditStorePage />} />

          <Route path="/saleinvoice" element={<SaleInvoicesDisplayPage />} />
          <Route path="/saleinvoice/:id" element={<SingleSaleInvoicePage />} />
          <Route path="/addsaleinvoice" element={<AddSaleInvoicePage />} />

          <Route
            path="/editsaleinvoice/:id"
            element={<EditSaleInvoicePage />}
          />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      {loggedIn && records && <Footer />}
    </>
  );
}

export default App;
