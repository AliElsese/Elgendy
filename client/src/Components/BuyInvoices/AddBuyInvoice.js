import React, { useState, useEffect } from "react";
import PageTitle from "../Uitily/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { createNewBuyInvoice } from "../../Redux/actions/buyInvoiceAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import notify from "../../hook/useNotifaction";
const AddBuyInvoice = () => {
  const dispatch = useDispatch();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const subForm = {
    proCode: "",
    proPrice: "",
    proQuantity: "",
    proSale: "",
    proTaxRate: "",
    proName: "",
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
            setArray(res.data.data.proPrice, "proPrice", index);
          })
          .catch((err) => {
            setArray("", "proName", index);
            setArray("", "proPrice", index);

            if (err.response) {
              err.response.data.errors.map((error) => {
                if (error.msg) {
                  notify(`${error.msg}  ${e.target.value}`, "error");
                }
              });
            }
          });
      } else {
        setArray("", "proName", index);
        setArray("", "proPrice", index);
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

  const handelSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const body = { invoiceNumber, products };
    await dispatch(createNewBuyInvoice(body));
    setLoading(false);
  };

  const res = useSelector((state) => state.buyInvoiceReducer.createBuyInvoice);
  useEffect(() => {
    if (loading === false) {
      setLoading(true);
      if (res) {
        if (res.data.errors) {
          res.data.errors.map((error) => {
            if (error.msg) {
              notify(`${error.msg}`, "error");
            }
          });
        }
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
        <PageTitle title="اضافة فاتورة شراء" />

        <div className="card ">
          <div className="card-body m-3">
            <form>
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
              <hr />

              <div className="table-card">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">كود الصنف</th>
                      <th scope="col">اسم الصنف</th>
                      <th scope="col">السعر</th>
                      <th scope="col">الكمية</th>
                      <th scope="col">الخصم</th>
                      <th scope="col">نسبة الضريبة</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((key, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            {" "}
                            <input
                              type="text"
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
                            {" "}
                            <input
                              type="text"
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
                              type="number"
                              onKeyDown={handleEnter}
                              id="proPrice"
                              name="proPrice"
                              value={key.proPrice}
                              onChange={(e) =>
                                setArray(e.target.value, "proPrice", index)
                              }
                            />
                          </td>
                          <td>
                            {" "}
                            <input
                              type="number"
                              name="proQuantity"
                              onKeyDown={handleEnter}
                              value={key.proQuantity}
                              onChange={(e) =>
                                setArray(e.target.value, "proQuantity", index)
                              }
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              onKeyDown={handleEnter}
                              id="proSale"
                              name="proSale"
                              value={key.proSale}
                              onChange={(e) =>
                                setArray(e.target.value, "proSale", index)
                              }
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              onKeyDown={handleEnter}
                              name="proTaxRate"
                              value={key.proTaxRate}
                              id="proTaxRate"
                              onChange={(e) =>
                                setArray(e.target.value, "proTaxRate", index)
                              }
                            />
                          </td>
                          <td>
                            <div className="d-flex">
                              {products.length > 1 && (
                                <button
                                  className="table-btn me-3"
                                  type="button"
                                  onClick={() => removeProd(index)}>
                                  -
                                </button>
                              )}
                              {index === products.length - 1 && (
                                <button
                                  className="table-btn "
                                  type="button"
                                  onClick={() => addProd()}>
                                  +
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
      <ToastContainer autoClose={false} />
    </div>
  );
};

export default AddBuyInvoice;
