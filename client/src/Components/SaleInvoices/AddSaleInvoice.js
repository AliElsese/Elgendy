import React, { useState, useEffect } from "react";
import PageTitle from "../Uitily/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import notify from "../../hook/useNotifaction";
import { createNewSaleInvoice } from "./../../Redux/actions/saleInvoiceAction";
import { getAllCompany } from "./../../Redux/actions/companyAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddSaleInvoice = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCompany());
  }, []);
  const resCompany = useSelector((state) => state.companyReducer.allCompany);

  let company = [];

  try {
    if (resCompany.data) company = resCompany.data;
    else company = [];
  } catch (e) {}

  const [companyId, setCompanyId] = useState("0");
  const onSelectCompany = async (e) => {
    setCompanyId(e.target.value);
  };
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const subForm = {
    proCode: "",
    proName: "",
    proQuantity: "",
    proCost: "",
    proPackaging: "",
  };

  const [products, setProducts] = useState(
    Array.from({ length: 5 }, (item) => Object.assign({ ...subForm }))
  );

  const [loading, setLoading] = useState(true);

  function setArray(value, key, index) {
    let currentArray = [...products];
    currentArray[index][key] = value || "";
    setProducts(currentArray);
  }

  function addProd() {
    let currentArray = [...products];
    currentArray.push({ ...subForm });
    setProducts(currentArray);
  }

  function removeProd(index) {
    let currentArray = [...products];
    currentArray.splice(index, 1);
    setProducts(currentArray);
  }

  const [timer, setTimer] = useState(null);
  const handleCode = (index, e) => {
    const fetchData = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      if (e.target.value !== "") {
        await axios
          .post(
            "http://localhost:8101/products/getProductCode",
            { proCode: `${e.target.value}` },
            config
          )
          .then((res) => {
            setArray(res.data.data.proName, "proName", index);
            setArray(res.data.data.proPrice, "proCost", index);
            setArray(res.data.data.proPackaging, "proPackaging", index);
          })
          .catch((err) => {
            setArray("", "proName", index);
            setArray("", "proCost", index);
            setArray("", "proPackaging", index);
            if (err.response) {
              err.response.data.errors.map((error) => {
                if (error.msg) {
                  // notify(`${error.msg}`, "error");
                  toast.error(`${error.msg} ${e.target.value}`, {
                    autoClose: false,
                  });
                }
              });
            }
          });
      } else {
        setArray("", "proName", index);
        setArray("", "proCost", index);
        setArray("", "proPackaging", index);
      }
    };
    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      fetchData();
    }, 500);

    setTimer(newTimer);
  };
  const handleEnter = (event) => {
    if (event.key.toLowerCase() === "enter") {
      const form = event.target.form;

      const index = [...form].indexOf(event.target);

      if (form.elements[index + 1].tagName === "BUTTON") {
        form.elements[index + 2].focus();
      } else {
        form.elements[index + 1].focus();
      }
      if (form.elements[index + 2].tagName === "BUTTON") {
        form.elements[index + 2].blur();
      }
      event.preventDefault();
    }
  };
  const handelSubmit = async (e) => {
    e.preventDefault();
    if (companyId === "0") {
      notify("من فضلك اختار اسم الشركة ", "error");
      return;
    }
    setLoading(true);
    const body = {
      companyId,
      clientName,
      clientAddress,
      registrationNumber,
      invoiceNumber,
      products,
    };
    await dispatch(createNewSaleInvoice(body));
    setLoading(false);
  };
  const res = useSelector(
    (state) => state.saleInvoiceReducer.createSaleInvoice
  );
  useEffect(() => {
    if (loading === false) {
      setLoading(true);

      if (res.data.errors) {
        res.data.errors.map((error) => {
          if (error.msg) {
            // notify(`${error.msg}`, "error");
            toast.error(`${error.msg}`, {
              autoClose: false,
            });
          }
        });
      }
      if (res.status === 201) {
        notify("تمت الاضافة بنجاح", "success");
        setTimeout(() => window.location.reload(false), 1000);
      }
    }
  }, [loading]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle title="اضافة فاتورة بيع" />
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
                    onChange={onSelectCompany}
                    className="form-select"
                    id="companyName">
                    <option value="0">اسم الشركة</option>
                    {company
                      ? company.map((item, index) => {
                          return (
                            <option key={index} value={item._id}>
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
                    onKeyDown={handleEnter}
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
                    onKeyDown={handleEnter}
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
                    onKeyDown={handleEnter}
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
                    onKeyDown={handleEnter}
                    onChange={(e) => {
                      setRegistrationNumber(e.target.value);
                    }}
                  />
                </div>
              </div>

              <hr />

              <div className="table-card">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">كود الصنف</th>
                      <th scope="col">اسم الصنف</th>
                      <th scope="col">العبوة</th>
                      <th scope="col">السعر</th>
                      <th scope="col">الكمية</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((key, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              className=""
                              name="proCode"
                              value={key.proCode}
                              onKeyDown={handleEnter}
                              onKeyUp={(e) => {
                                handleCode(index, e);
                              }}
                              onChange={(e) =>
                                setArray(e.target.value, "proCode", index)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className=""
                              name="proName"
                              value={key.proName}
                              title={key.proName}
                              onKeyDown={handleEnter}
                              onChange={(e) =>
                                setArray(e.target.value, "proName", index)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className=""
                              name="proPackaging"
                              onKeyDown={handleEnter}
                              value={key.proPackaging}
                              id="proPackaging"
                              onChange={(e) =>
                                setArray(e.target.value, "proPackaging", index)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className=""
                              onKeyDown={handleEnter}
                              id="proCost"
                              name="proCost"
                              value={key.proCost}
                              onChange={(e) =>
                                setArray(e.target.value, "proCost", index)
                              }
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              className=""
                              name="proQuantity"
                              onKeyDown={handleEnter}
                              value={key.proQuantity}
                              onChange={(e) =>
                                setArray(e.target.value, "proQuantity", index)
                              }
                            />
                          </td>
                          <td>
                            <div className="d-flex">
                              {index === products.length - 1 && (
                                <button
                                  className="table-btn "
                                  type="button"
                                  onClick={() => addProd()}>
                                  +
                                </button>
                              )}
                              {products.length > 1 && (
                                <button
                                  className="table-btn me-3"
                                  type="button"
                                  onClick={() => removeProd(index)}>
                                  -
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
      <ToastContainer />
    </div>
  );
};

export default AddSaleInvoice;
