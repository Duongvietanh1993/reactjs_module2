import React from "react";
import "./footer.css";

export default function Footer() {
  return (
    <>
      <footer>
        <div className="container grid2">
          <div className="box">
            <h1 style={{ textAlign: "left" }}>LOGO</h1>
            <p style={{ textAlign: "left" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor
              libero id et, in gravida. Sit diam duis mauris nulla cursus. Erat
              et lectus vel ut sollicitudin elit at amet.
            </p>
            <div className="icon flex justify-content-center gap-5">
              <div className="img d_flex">
                <i className="fa-brands fa-google-play"></i>
                <span>Google Play</span>
              </div>
              <div className="img d_flex">
                <i className="fa-brands fa-app-store-ios"></i>
                <span>App Store</span>
              </div>
            </div>
          </div>

          <div className="box">
            <h2>About Us</h2>
            <ul>
              <li>Careers</li>
              <li>Our Stores</li>
              <li>Our Cares</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div className="box">
            <h2>Customer Care</h2>
            <ul>
              <li>Help Center </li>
              <li>How to Buy </li>
              <li>Track Your Order </li>
              <li>Corporate & Bulk Purchasing </li>
              <li>Returns & Refunds </li>
            </ul>
          </div>
          <div className="box">
            <h2>Contact Us</h2>
            <ul>
              <li>Nhà 56b ngõ 896 đường Nguyễn Khoái, Thanh Trì,Hoàng Mai, Hà Nội </li>
              <li>Email: support@gmail.com</li>
              <li>Phone: +84 363 304 513</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
