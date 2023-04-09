import React from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import LogoutButton from "./LogoutButton";
import "./Sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
const Sidebar = ({ isMenuActive }) => {
  const location = useLocation();
  const key = () => {
    if (location.pathname.includes("product")) {
      return "0";
    } else if (location.pathname.includes("store")) {
      return "1";
    } else if (location.pathname.includes("buyinvoice")) {
      return "2";
    } else if (location.pathname.includes("saleinvoice")) {
      return "3";
    } else if (location.pathname.includes("users")) {
      return "4";
    } else if (location.pathname.includes("company")) {
      return "5";
    }
  };
  return (
    <div className={isMenuActive === true ? `sidebar active` : `sidebar `}>
      <Accordion defaultActiveKey={[key()]} alwaysOpen>
        <Accordion.Item eventKey="4">
          <Accordion.Header>
            المستخدمين
            <span className="arrow-icon">
              <IoIosArrowDown />
            </span>
          </Accordion.Header>

          <Accordion.Body>
            <ul className="nav nav-sm flex-column">
              <li className="nav-item">
                <NavLink to="/users" className="nav-link">
                  بيان المستخدمين
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/adduser" className="nav-link">
                  اضافة مستخدم جديد
                </NavLink>
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="5">
          <Accordion.Header>
            الشركات
            <span className="arrow-icon">
              <IoIosArrowDown />
            </span>
          </Accordion.Header>

          <Accordion.Body>
            <ul className="nav nav-sm flex-column">
              <li className="nav-item">
                <NavLink to="/company" className="nav-link">
                  بيان الشركات
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/addcompany" className="nav-link">
                  اضافة شركة جديدة
                </NavLink>
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            الاصناف
            <span className="arrow-icon">
              <IoIosArrowDown />
            </span>
          </Accordion.Header>

          <Accordion.Body>
            <ul className="nav nav-sm flex-column">
              <li className="nav-item">
                <NavLink to="/product" className="nav-link">
                  بيان الاصناف
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/addproduct" className="nav-link">
                  اضافة صنف جديد
                </NavLink>
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            المخزن
            <span className="arrow-icon">
              <IoIosArrowDown />
            </span>
          </Accordion.Header>

          <Accordion.Body>
            <ul className="nav nav-sm flex-column">
              <li className="nav-item">
                <NavLink to="/store" className="nav-link">
                  بيان المخزن
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/addstore" className="nav-link">
                  اضافة صنف الى المخزن
                </NavLink>
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            فواتير الشراء
            <span className="arrow-icon">
              <IoIosArrowDown />
            </span>
          </Accordion.Header>

          <Accordion.Body>
            <ul className="nav nav-sm flex-column">
              <li className="nav-item">
                <NavLink to="/buyinvoice" className="nav-link">
                  تقرير الفواتير
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/addbuyinvoice" className="nav-link">
                  اضافة فاتورة جديدة
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/addbuyinvoicepdf" className="nav-link">
                  اضافة فاتورة pdf
                </NavLink>
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>
            فواتير البيع
            <span className="arrow-icon">
              <IoIosArrowDown />
            </span>
          </Accordion.Header>

          <Accordion.Body>
            <ul className="nav nav-sm flex-column">
              <li className="nav-item">
                <NavLink to="/saleinvoice" className="nav-link">
                  تقرير الفواتير
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/addsaleinvoice" className="nav-link">
                  اضافة فاتورة جديدة
                </NavLink>
              </li>

            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="logout">
        {" "}
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
