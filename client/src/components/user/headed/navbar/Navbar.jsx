import React from "react";
import { NavLink } from "react-router-dom";
import { resourceForm } from "../../../../resources/resourceVN";
import { CoffeeOutlined, HomeOutlined, PhoneOutlined, SkinOutlined, TeamOutlined } from "@ant-design/icons";


export default function Navbar() {
  return (
    <>
      <header className="header ">
        <div className="container d_flex ">
          <div className="navlink">
            <ul className=" link f_flex capitalize">
              <li>
                <NavLink to="/">
                  <span style={{ fontSize: 19 }}><HomeOutlined /> {resourceForm.headingHome}</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="list-product">
                  <span style={{ fontSize: 19 }}><SkinOutlined /> {resourceForm.headingProductList}</span>
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="navlink">
            <ul className="link f_flex capitalize">
              <li>
                <NavLink to="about">
                  <span style={{ fontSize: 18 }}><TeamOutlined /> {resourceForm.headingAbout}</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="contact">
                  <span style={{ fontSize: 18 }}><PhoneOutlined /> {resourceForm.headingContact}</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="my_order">
                  <span style={{ fontSize: 18 }}><CoffeeOutlined /> {resourceForm.headingOrder}</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}
