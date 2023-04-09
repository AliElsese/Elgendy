import React, { useState, useEffect } from "react";
import PageTitle from "../Uitily/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOneBuyInvoice,
  updateBuyInvoice,
} from "../../Redux/actions/buyInvoiceAction";
import notify from "../../hook/useNotifaction";
const EditBuyInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState(true);
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await dispatch(getOneBuyInvoice(id));
      setLoading(false);
    };
    run();
  }, []);

  const item = useSelector((state) => state.buyInvoiceReducer.oneBuyInvoice);

  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    if (loading === false) {
      if (item && item.data) {
        setInvoiceNumber(item.data.invoiceNumber);
      }
    }
  }, [loading]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (invoiceNumber === "") {
      notify("من فضلك ادخل رقم الفاتورة ", "error");
      return;
    }

    setLoadingEdit(true);
    const body = { invoiceNumber };

    await dispatch(updateBuyInvoice(id, body));
    setLoadingEdit(false);
  };
  const res = useSelector((state) => state.buyInvoiceReducer.updateBuyInvoice);
  useEffect(() => {
    if (loadingEdit === false) {
      setLoadingEdit(true);

      if (res.data.status) {
        if (res.data.status === "error") {
          notify("تم انشاء فاتورة بهذا الرقم من قبل", "error");
        }
      }

      if (res.status === 200) {
        notify("تمت التعديل  بنجاح", "success");
        setTimeout(() => navigate("/buyinvoice"), 1000);
      }
    }
  }, [loadingEdit]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle title="تعديل فاتورة شراء" />
        <div className="card ">
          <div className="card-body m-3">
            <div className="row mb-3">
              <label
                htmlFor="invoiceNumber"
                className="col-sm-3 col-lg-2 col-form-label">
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

            <button
              className="btn btn-primary mt-3"
              type="submit"
              onClick={handelSubmit}>
              حفظ
            </button>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={false} />
    </div>
  );
};

export default EditBuyInvoice;
