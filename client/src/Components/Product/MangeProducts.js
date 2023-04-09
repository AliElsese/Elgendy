import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../Uitily/PageTitle";
import { ToastContainer } from "react-toastify";
import AllProductHook from "../../hook/product/all-product-hook";
import { Modal, Button } from "react-bootstrap";
import { AiOutlineEdit } from "react-icons/ai";
import DataTable from "react-data-table-component";
import { AiOutlineDelete } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import DeleteProductHook from "./../../hook/product/delete-product-hook";

const MangeProducts = () => {
  const [query, setQuery] = useState("");
  const [show, handleClose, handleShow, handelDelete] = DeleteProductHook();
  const [allProduct, handlePrint, isPress] = AllProductHook();
  const columns = [
    {
      name: "كود الصنف",
      selector: (row) => row.proCode,
      // sortable: true,
    },
    {
      name: "اسم الصنف",
      selector: (row) => row.proName,
      // sortable: true,
    },
    {
      name: "العبوة",
      selector: (row) => row.proPackaging,
    },
    {
      name: "السعر",
      selector: (row) => row.proPrice,
    },

    {
      name: "تعديل ",
      cell: (row) => (
        <Link to={`/editproduct/${row._id}`}>
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
    <div className="page-content ">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            {" "}
            <div>تاكيد الحذف</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>هل انت متاكد من عملية الحذف للصنف</div>
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
        <PageTitle title="بيان الاصناف" />
        <div className="row pb-4">
          <div className="col-sm-6 ">
            <button
              className="btn main-btn"
              disabled={isPress}
              onClick={handlePrint}>
              تحميل بيان{" "}
            </button>
          </div>
        </div>

        <div className="custom-table mt-4 name-content">
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
            data={allProduct.filter(
              (row) =>
                row.proName.includes(query) || row.proCode.includes(query)
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

export default MangeProducts;
