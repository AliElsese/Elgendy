import React from "react";
import PageTitle from "../Uitily/PageTitle";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SingleSaleInvoiceHook from "../../hook/saleInvoice/single-sale-invoice-hook";
import PrintSingleBuyInvoiceHook from "../../hook/saleInvoice/print-single-sale-invoice-hook";
const SingleSaleInvoice = () => {
  const { id } = useParams();
  const [saleInvoice] = SingleSaleInvoiceHook(id);

  const [handelPrint, isPress] = PrintSingleBuyInvoiceHook(id);
  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle title={`عرض تفاصيل فاتورة البيع`} />
        <div className="row pb-4">
          <div className="col-sm-6 ">
            <button
              onClick={handelPrint}
              disabled={isPress}
              className="btn main-btn">
              تحميل تقرير فاتورة بيع
            </button>
          </div>
        </div>

        <div className="table-card  mt-4">
          <div className="pt-4 pb-3">
            <h6>رقم الفاتورة : {saleInvoice.invoiceNumber}</h6>
            <h6>
              {" "}
              التاريخ : <span className="date">{saleInvoice.invoiceDate}</span>
            </h6>
            <h6>رقم التسجيل :{saleInvoice.registrationNumber} </h6>
            <h6>اسم العميل :{saleInvoice.clientName} </h6>
          </div>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th scope="col">كود الصنف</th>
                <th scope="col">اسم الصنف</th>
                <th scope="col">الكمية</th>
                <th scope="col">السعر</th>
                <th scope="col">الخصم</th>
                <th scope="col">قيمة الضريبة</th>
                <th scope="col">اجمالى شامل الضريبة</th>
              </tr>
            </thead>
            <tbody>
              {saleInvoice.products
                ? saleInvoice.products.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.proCode}</td>
                        <td>{item.proName}</td>
                        <td>{item.proQuantity}</td>
                        <td>{item.proPrice}</td>
                        <td>{item.proSale}</td>
                        <td>{item.proTaxValue}</td>
                        <td>{item.proTotalVat}</td>
                      </tr>
                    );
                  })
                : null}
              <tr>
                <td colSpan="4" className="text-end">
                  الاجمالى
                </td>
                <td colSpan="5" className="text-start">
                  {saleInvoice.invoiceTotalVat}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer autoClose={false} />
    </div>
  );
};

export default SingleSaleInvoice;
