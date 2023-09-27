import React, { useEffect, useState } from "react";
import { formatMoney } from "../../../utils/formatData";

export default function NewCard() {
  const [newArrival, setNewArrival] = useState([]);

  // gọi API lấy thông tin tất cả sản phẩm
  const loadDataFlash = () => {
    fetch("http://localhost:8000/newdata")
      .then((response) => response.json()) //ép kiểu json
      .then((response) => setNewArrival(response)) // nơi có dữ liệu trả về
      .catch((error) => console.log(error)); // bắt lỗi
  };
  useEffect(() => {
    loadDataFlash();
  }, []);
  return (
    <>
      <div className="content grid product">
        {newArrival.map((val, index) => (
          <div className="box text-center" key={index}>
            <div className="img">
              <img src={val.cover} alt="" />
            </div>
            <h4 className="text-xl mt-3">{val.name}</h4>
            <span className="text-xl mt-2">{formatMoney(val.price)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
