import React from "react";

export default function Head() {
  return (
    <>
      <section className="head">
        <div className=" flex justify-between px-64">
          <div className="left flex ">
            <i className="fa fa-phone"></i>
            <label> +84 363 304 513</label>
            <i className="fa fa-envelope"></i>
            <label> support@gmail.com</label>
          </div>
          <div className="right flex">
            <label>Theme FAQ"s</label>
            <label>Need Help?</label>
            <span>🏳️‍⚧️</span>
            <label>VN</label>
            <span>🏳️‍⚧️</span>
            <label>EN</label>
          </div>
        </div>
      </section>
    </>
  );
}
