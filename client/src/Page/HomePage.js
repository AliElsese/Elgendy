import React from "react";
import { Link } from "react-router-dom";
import AllProductHook from "./../hook/product/all-product-hook";
import AllSaleInvoiceHook from "./../hook/saleInvoice/all-sale-invoice-hook";
import AllBuyInvoiceHook from "./../hook/buyInvoice/all-buy-invoice-hook";
import AllStoreHook from "./../hook/store/all-store-hook";
import AllUsersHook from "./../hook/user/all-user-hook";
import AllCompanyHook from "./../hook/company/all-company-hook";

const HomePage = () => {
  const [allProduct] = AllProductHook();
  const [allStore] = AllStoreHook();
  const [allBuyInvoice] = AllBuyInvoiceHook();
  const [allSaleInvoice] = AllSaleInvoiceHook();
  const [allCompany] = AllCompanyHook();
  const [users] = AllUsersHook();
  return (
    <div className="home-content">
      <div className="container">
        <div className="home-wrapper">
          <div className="row  pb-4">
            <div className=" col-md-4  col-sm-6 mb-3">
              <Link to="/users">
                <div className="card">
                  <div className="card-body text-center">
                    <h5>المستخدمين</h5>
                    <p className="card-number">{users.length} مستخدم</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className=" col-md-4  col-sm-6 mb-3">
              <Link to="/company">
                <div className="card">
                  <div className="card-body text-center">
                    <h5>الشركات</h5>
                    <p className="card-number">{allCompany.length} شركة</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className=" col-md-4  col-sm-6 mb-3">
              <Link to="/product">
                <div className="card">
                  <div className="card-body text-center">
                    <h5>الاصناف</h5>
                    <p className="card-number">{allProduct.length} صنف</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className=" col-md-4  col-sm-6 mb-3">
              <Link to="/store">
                <div className="card">
                  <div className="card-body text-center">
                    <h5>المخزن</h5>
                    <p className="card-number">{allStore.length} صنف</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className=" col-md-4  col-sm-6 mb-3">
              <Link to="/buyinvoice">
                <div className="card">
                  <div className="card-body text-center">
                    <h5>فواتير الشراء</h5>
                    <p className="card-number">{allBuyInvoice.length} فاتورة</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className=" col-md-4  col-sm-6 mb-3">
              <Link to="/saleinvoice">
                <div className="card">
                  <div className="card-body text-center">
                    <h5>فواتير البيع</h5>
                    <p className="card-number">
                      {allSaleInvoice.length} فاتورة
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
