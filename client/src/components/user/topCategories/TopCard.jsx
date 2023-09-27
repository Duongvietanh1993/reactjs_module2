import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function TopCard() {
  const [topdata, setTopdata] = useState([]);

  // gọi API lấy thông tin tất cả sản phẩm
  const loadDataTopCate = () => {
    fetch("http://localhost:8000/topdata")
      .then((response) => response.json()) //ép kiểu json
      .then((response) => setTopdata(response)) // nơi có dữ liệu trả về
      .catch((error) => console.log(error)); // bắt lỗi
  };
  useEffect(() => {
    loadDataTopCate();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
  };
  return (
    <>
      <Slider {...settings}>
        {topdata.map((value, index) => (
          <div className="box product" key={index}>
            <div className="nametop d_flex">
              <span className="tleft">{value.para}</span>
              <span className="tright">{value.desc}</span>
            </div>
            <div className="img">
              <img src={value.cover} alt="" />
            </div>
          </div>
        ))}
      </Slider>
    </>
  );
}
