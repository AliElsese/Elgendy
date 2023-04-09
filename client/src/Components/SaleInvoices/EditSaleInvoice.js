import React, { useState, useEffect } from "react";
import PageTitle from "../Uitily/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { getAllCompany } from "./../../Redux/actions/companyAction";
import notify from "../../hook/useNotifaction";
import {
  getOneSaleInvoice,
  updateSaleInvoice,
} from "./../../Redux/actions/saleInvoiceAction";
const EditSaleInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState(true);
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await dispatch(getOneSaleInvoice(id));
      await dispatch(getAllCompany());
      setLoading(false);
    };
    run();
  }, []);

  const resCompany = useSelector((state) => state.companyReducer.allCompany);

  let company = [];

  try {
    if (resCompany.data) company = resCompany.data;
    else company = [];
  } catch (e) {}

  const [companyId, setCompanyId] = useState("");
  const onSelectCompany = async (e) => {
    setCompanyId(e.target.value);
  };

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  const item = useSelector((state) => state.saleInvoiceReducer.oneSaleInvoice);

  useEffect(() => {
    if (loading === false) {
      if (item && item.data) {
        setClientName(item.data.clientName);
        setClientAddress(item.data.clientAddress);
        setRegistrationNumber(item.data.registrationNumber);
        setCompanyName(item.data.companyName);
        setInvoiceNumber(item.data.invoiceNumber);
        company.map((res) => {
          if (res.companyName === item.data.companyName) {
            setCompanyId(res._id);
          }
        });
      }
    }
  }, [loading]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (companyId === "0") {
      notify("من فضلك اختار اسم الشركة ", "error");
      return;
    }
    setLoadingEdit(true);
    const body = {
      invoiceNumber,
      companyId,
      clientName,
      clientAddress,
      registrationNumber,
    };

    await dispatch(updateSaleInvoice(id, body));
    setLoadingEdit(false);
  };
  const res = useSelector(
    (state) => state.saleInvoiceReducer.updateSaleInvoice
  );
  useEffect(() => {
    if (loadingEdit === false) {
      setLoadingEdit(true);
      if (res.data.errors) {
        res.data.errors.map((error) => {
          if (error.msg) {
            notify(`${error.msg}`, "error");
          }
        });
      }
      if (res.status === 200) {
        notify("تمت التعديل  بنجاح", "success");
        setTimeout(() => navigate("/saleinvoice"), 1000);
      }
    }
  }, [loadingEdit]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle title="تعديل فاتورة بيع" />
        <div className="card ">
          <div className="card-body m-3">
            <form>
              <div className="row mb-3">
                <label
                  htmlFor="companyName"
                  className="col-sm-3 col-lg-2 col-form-label table-label">
                  اسم الشركة
                </label>
                <div className="col-sm-9 col-lg-10">
                  <select
                    name="companyName"
                    value={companyId}
                    onChange={onSelectCompany}
                    className="form-select"
                    id="companyName">
                    <option value="0">اسم الشركة</option>
                    {company
                      ? company.map((item, index) => {
                          return (
                            <option
                              key={index}
                              value={item._id}
                              // selected={item.companyName === companyName}
                            >
                              {item.companyName}
                            </option>
                          );
                        })
                      : null}
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="clientName"
                  className="col-sm-3 col-lg-2 col-form-label table-label">
                  اسم العميل
                </label>
                <div className="col-sm-9 col-lg-10">
                  <input
                    type="text"
                    className="form-control"
                    id="clientName"
                    placeholder="اسم العميل"
                    value={clientName}
                    onChange={(e) => {
                      setClientName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="invoiceNumber"
                  className="col-sm-3 col-lg-2 col-form-label table-label">
                  رقم الفاتورة
                </label>
                <div className="col-sm-9 col-lg-10">
                  <input
                    type="text"
                    className="form-control"
                    id="invoiceNumber"
                    placeholder="رقم الفاتورة"
                    value={invoiceNumber}
                    onChange={(e) => {
                      setInvoiceNumber(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="clientAddress"
                  className="col-sm-3 col-lg-2 col-form-label table-label">
                  العنوان
                </label>
                <div className="col-sm-9 col-lg-10">
                  <input
                    type="text"
                    className="form-control"
                    id="clientAddress"
                    placeholder=" العنوان"
                    value={clientAddress}
                    onChange={(e) => {
                      setClientAddress(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="registrationNumber"
                  className="col-sm-3 col-lg-2 col-form-label table-label">
                  رقم التسجيل
                </label>
                <div className="col-sm-9 col-lg-10">
                  <input
                    type="text"
                    className="form-control"
                    id="registrationNumber"
                    placeholder=" رقم التسجيل"
                    value={registrationNumber}
                    onChange={(e) => {
                      setRegistrationNumber(e.target.value);
                    }}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary mt-3"
                type="button"
                onClick={handelSubmit}>
                حفظ
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={false} />
    </div>
  );
};

export default EditSaleInvoice;
