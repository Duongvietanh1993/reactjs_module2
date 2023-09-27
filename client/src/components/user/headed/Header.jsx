import React from "react";
import Head from "./head/Head";
import Search from "./search/Search";
import Navbar from "./navbar/Navbar";
import "./header.css";

export default function Header({loadCountCart}) {
  return (
    <>
      <Head />
      <Search loadCountCart={loadCountCart}/>
      <Navbar />
    </>
  );
}
