import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formatMoney } from "../../../utils/formatData";


export default function DiscountCard() {
  const [discountData, setDiscountData] = useState([]);

  // gọi API lấy thông tin tất cả sản phẩm
  const loadDataTopCate = () => {
    fetch("http://localhost:8000/discountData")
      .then((response) => response.json()) //ép kiểu json
      .then((response) => setDiscountData(response)) // nơi có dữ liệu trả về
      .catch((error) => console.log(error)); // bắt lỗi
  };

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
  };
  useEffect(() => {
    loadDataTopCate();
  }, []);
  return (
    <>
      <Slider {...settings}>
        {discountData.map((value, index) => (
          <div className="box product text-center" key={index}>
            <div className="img">
              <img src={value.cover} alt={value.cover} width="100%" />
            </div>
            <h4 className="mb-1 text-xl">{value.name}</h4>
            <span>{formatMoney(value.price)}</span>
          </div>
        ))}
      </Slider>
    </>
  );
}
