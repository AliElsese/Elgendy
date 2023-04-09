import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import PageTitle from "../Uitily/PageTitle";
import { Modal, Button } from "react-bootstrap";
import { AiOutlineEdit } from "react-icons/ai";
import DataTable from "react-data-table-component";
import { AiOutlineDelete } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import AllCompanyHook from "../../hook/company/all-company-hook";
import DeleteCompanyHook from "../../hook/company/delete-company-hook";
const AllCompany = () => {
  const [query, setQuery] = useState("");
  const [allCompany] = AllCompanyHook();
  const [show, handleClose, handleShow, handelDelete, loading] =
    DeleteCompanyHook();

  const columns = [
    {
      name: "اسم الشركة",
      selector: (row) => row.companyName,
      sortable: true,
    },

    {
      name: "تخصص الشركة",
      selector: (row) => row.companyScope,
    },
    {
      name: "عنوان الشركة",
      selector: (row) => row.companyAddress,
    },
    {
      name: "رقم السجل الضريبى",
      selector: (row) => row.companyTaxNumber,
    },
    {
      name: "فرع الشركة",
      selector: (row) => row.companyBranche,
    },

    {
      name: "تعديل ",
      cell: (row) => (
        <Link to={`/editcompany/${row._id}`}>
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
          <div>هل انت متاكد من عملية الحذف للشركة</div>
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
        <PageTitle title=" بيان الشركات" />
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
          data={allCompany.filter((row) => row.companyName.includes(query))}
          pagination
          customStyles={customStyles}
        />
      </div>
      <ToastContainer autoClose={false} />
    </div>
  );
};

export default AllCompany;
