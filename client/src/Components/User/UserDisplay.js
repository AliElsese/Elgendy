import React, { useEffect, useState } from "react";
import PageTitle from "./../Uitily/PageTitle";
import { ToastContainer } from "react-toastify";
import DataTable from "react-data-table-component";
import { BsSearch } from "react-icons/bs";
import AllUsersHook from "./../../hook/user/all-user-hook";

import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import DeleteUserHook from "./../../hook/user/delete-user-hook";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
const UserDisplay = () => {
  const [users] = AllUsersHook();
  const [query, setQuery] = useState("");
  const [showDelete, handleDeletClose, handleDeleteShow, handelDelete] =
    DeleteUserHook();

  const columns = [
    {
      name: "اسم المستخدم",
      selector: (row) => row.username,
    },
    {
      name: "نشط",
      cell: (row) => (row.isActive === true ? "نعم" : "لا"),
    },

    {
      name: "تعديل ",
      cell: (row) => (
        <Link to={`/edituser/${row._id}`}>
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
            handleDeleteShow(row._id);
          }}
        />
      ),
    },
  ];
  const customStyles = {
    headCells: {
      style: {
        fontWeight: "600",
        fontSize: "16px",
      },
    },
    cells: {
      style: {
        whiteSpace: "pre-wrap",
        fontSize: "15px",
      },
    },
  };

  return (
    <div className="page-content">
      <Modal show={showDelete} onHide={handleDeletClose}>
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
          <Button variant="success" onClick={handleDeletClose}>
            تراجع
          </Button>
          <Button variant="dark" onClick={handelDelete}>
            حذف
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container-fluid">
        <PageTitle title="بيان المستخدمين" />

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
            data={users.filter((row) =>
              row.username.toLowerCase().includes(query)
            )}
            pagination
            customStyles={customStyles}
          />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UserDisplay;
