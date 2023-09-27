import React from "react";
import "./topCate.css";
import TopCard from "./TopCard";
import { resourceForm } from "../../../resources/resourceVN";

export default function TopCategorie() {
  return (
    <>
      <section className="TopCate flash background flex">
        <div className="container ">
          <div className="heading d_flex">
            <div className="heading-left flex justify-center items-center mb-2">
              <i className="fa-solid fa-border-all "></i>
              <h2>{resourceForm.headingTop}</h2>
            </div>
            <div className="heading-right flex justify-center items-center">
              <span className="text-red-500">{resourceForm.view}</span>
              <i className="fa-solid fa-caret-right"></i>
            </div>
          </div>
          <TopCard />
        </div>
      </section>
    </>
  );
}
