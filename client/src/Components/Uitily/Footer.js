import React from "react";
import { AiOutlineWhatsApp, AiOutlinePhone } from "react-icons/ai";
import logo from "../../images/LOGO-colored.png";
const Footer = () => {
  return (
    <footer className="footer">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                        <img src={logo} alt="" />
                        </div>
                        <div className="col-sm-6">
                        <h6>أرقام التواصل</h6>
        <ul>
          <li>
            <AiOutlineWhatsApp /> : 01221246525
          </li>
          <li>
            <AiOutlinePhone /> : 01221246525
          </li>
        </ul>
                        </div>
                    </div>
                </div>
            </footer>

  );
};

export default Footer;
