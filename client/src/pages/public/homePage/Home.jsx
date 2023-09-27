import React, { useState } from "react";
import Header from "../../../components/user/headed/Header";
import Footer from "../../../components/user/footer/Footer";
import "./home.css";
import { Outlet } from "react-router-dom";
import { FloatButton } from "antd";

export default function Home({loadCountCart}) {
 


  return (
    <>
      <Header loadCountCart={loadCountCart} />
      <Outlet />
      <div className="pt-4 flash">
        <Footer />
      </div>
      <FloatButton.BackTop>
        <div className="your-backtop-content">Go to top</div>
      </FloatButton.BackTop>
    </>
  );
}
