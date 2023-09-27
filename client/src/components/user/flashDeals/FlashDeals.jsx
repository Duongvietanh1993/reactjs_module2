import React from "react";
import "./flashDeals.css";
import FlashCard from "./FlashCard";
import { resourceForm } from "../../../resources/resourceVN";

export default function FlashDeals({setLoadHeader}) {
  return (
    <>
      <section className="flash pt-5">
        <div className="container">
          <div className="heading f_flex justify-start text-2xl mb-2">
            <i className="fa fa-bolt"></i>
            <h1>{resourceForm.headingFlash}</h1>
          </div>
          <FlashCard setLoadHeader={setLoadHeader}/>
        </div>
      </section>
    </>
  );
}
