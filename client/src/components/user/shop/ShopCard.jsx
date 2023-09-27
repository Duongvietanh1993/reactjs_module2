import React, { useEffect, useState } from "react";
import "./shopCard.css";
import axios from "axios";
import { Pagination } from "antd";
import { formatMoney } from "./../../../utils/formatData";
import { resourceForm } from "../../../resources/resourceVN";
import { Link, NavLink } from "react-router-dom";
import ListProduct from "../../../pages/public/listProduct/ListProduct";
import { scrollToTop } from "react-scroll/modules/mixins/animate-scroll";

export default function ShopCard() {
  const [pageSize, setPageSize] = useState(6);
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productHome, setProductHome] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount(count + 1);
  };

  console.log(category);

  // gọi API lấy thông tin tất cả sản phẩm
  const loadDataCategory = () => {
    axios
      .get("http://localhost:8000/categories")
      .then((response) => {
        setCategory(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    loadDataCategory();
  }, []);

  //lấy ra id của category
  const getCategoryId = (id) => {
    setCategoryId(id);
  };

  // gọi API lấy thông tin tất cả sản phẩm
  const loadDataProducts = () => {
    axios
      .get("http://localhost:8000/products")
      .then((response) => {
        if (categoryId === 0) {
          setProductHome(response.data);
        } else {
          const listProducts = response.data.filter(
            (product) => product.category_id === categoryId
          );
          setProductHome(listProducts);
        }
      })
      .catch((error) => console.log(error)); // bắt lỗi
  };
  useEffect(() => {
    loadDataProducts();
  }, [categoryId]);

  //tính toán chỉ mục sản phẩm bắt đầu và chỉ mục sản phẩm kết thúc
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const displayedProduct = productHome.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

   //lên đầu trang
   const scrollToTop = () => {
    scroll.scrollToTop({
      smooth: true,
    });
  };

  return (
    <>
      <section className=" shop background flash heading mb-0 pb-0">
        <div className="container mb-0">
          <div className=" heading d_flex">
            <div className="heading-left f_flex">
              <img src="https://img.icons8.com/windows/32/fa314a/gift.png" />
              <h2>{resourceForm.headingShop}</h2>
            </div>
            <NavLink onClick={scrollToTop} to="list-product" className="heading-right">
              <span className="cursor-pointer text-red-500">
                {resourceForm.view}
              </span>
              <i className="fa-solid fa-caret-right"></i>
            </NavLink>
          </div>
         <ListProduct />
        </div>
      </section>
    </>
  );
}
