import React, { useState } from "react";

import PageTitle from "../Uitily/PageTitle";

import { ToastContainer } from "react-toastify";
import AllSaleInvoiceHook from "./../../hook/saleInvoice/all-sale-invoice-hook";

import DeleteSaleInvoiceHook from "./../../hook/saleInvoice/delete-sale-invoice-hook";
import { Modal, Button } from "react-bootstrap";
import { AiOutlineEdit } from "react-icons/ai";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
const SellInvoicesDisplay = () => {
  const [allSaleInvoice, handlePrint, isPress] = AllSaleInvoiceHook();
  const [show, handleClose, handleShow, handelDelete] = DeleteSaleInvoiceHook();
  const [query, setQuery] = useState("");
  const columns = [
    {
      name: "رقم الفاتورة",
      cell: (row) => (
        <Link className="single" to={`/saleinvoice/${row._id}`}>
          {row.invoiceNumber}
        </Link>
      ),
    },
    {
      name: "التاريخ",
      selector: (row) => row.invoiceDate,
    },
    {
      name: "اسم العميل",
      selector: (row) => row.clientName,
    },

    {
      name: "اجمالى السعر",
      selector: (row) => row.invoiceTotalVat,
    },

    {
      name: "تعديل ",
      cell: (row) => (
        <Link to={`/editsaleinvoice/${row._id}`}>
          <AiOutlineEdit className="table-icon" />
        </Link>
      ),
    },
    {
      name: "حذف",
      cell: (row) => (
        <AiOutlineDelete
          className="table-icon"
          onClick={() => {
            handleShow(row._id);
          }}
        />
      ),
    },
  ];
  const customStyles = {
    rows: {
      style: {
        minHeight: "60px",
      },
    },
    headCells: {
      style: {
        fontWeight: "600",
        fontSize: "15px",
      },
    },
    cells: {
      style: {
        whiteSpace: "pre-wrap",
        fontSize: "14px",
      },
    },
  };
  return (
    <div className="page-content">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            {" "}
            <div>تاكيد الحذف</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>هل انت متاكد من عملية الحذف للفاتورة</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            تراجع
          </Button>
          <Button variant="dark" onClick={handelDelete}>
            حذف
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container-fluid">
        <PageTitle title="تقرير فواتير البيع" />
        <div className="row pb-4">
          <div className="col-sm-6 ">
            <button
              disabled={isPress}
              onClick={handlePrint}
              className="btn main-btn">
              تحميل تقرير فواتير البيع
            </button>
          </div>
        </div>
        <div className="custom-table mt-4">
          <div className="search-box">
            <BsSearch className="search-icon" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              type="text"
              className="form-control"
              id="searchMemberList"
              placeholder="ابحث عن النتائج"
            />
          </div>
          <DataTable
            columns={columns}
            data={allSaleInvoice.filter((row) =>
              row.invoiceNumber.includes(query)
            )}
            pagination
            customStyles={customStyles}
          />
        </div>
      </div>

      <ToastContainer autoClose={false} />
    </div>
  );
};

export default SellInvoicesDisplay;
