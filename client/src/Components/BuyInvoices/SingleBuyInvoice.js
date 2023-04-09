import React from "react";
import PageTitle from "../Uitily/PageTitle";

import { useParams } from "react-router-dom";
import SingleBuyInvoiceHook from "../../hook/buyInvoice/single-buy-invoice-hook";

const SingleBuyInvoice = () => {
  const { id } = useParams();
  const [buyInvoice] = SingleBuyInvoiceHook(id);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle
          title={
            buyInvoice.invoiceNumber
              ? ` عرض تفاصيل فاتورة الشراء رقم ${buyInvoice.invoiceNumber} `
              : `عرض تفاصيل فاتورة الشراء`
          }
        />

        <div className="table-card  mt-4">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th scope="col">كود الصنف</th>
                <th scope="col">اسم الصنف</th>
                <th scope="col">العبوة</th>
                <th scope="col">السعر</th>
                <th scope="col">الكمية</th>
                <th scope="col">الخصم</th>
                <th scope="col">قيمة الضريبة</th>
                <th scope="col">اجمالى شامل الضريبة</th>
              </tr>
            </thead>
            <tbody>
              {buyInvoice.products
                ? buyInvoice.products.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.proCode}</td>
                        <td>{item.proName}</td>
                        <td>{item.proPackaging}</td>

                        <td>{item.proPrice}</td>
                        <td>{item.proQuantity}</td>
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
                  {buyInvoice.invoiceTotal}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SingleBuyInvoice;
