import React, { useEffect, useState } from "react";

import axios from "axios";
import { Card, Image, Modal, Pagination } from "antd";
import { formatMoney } from "./../../../utils/formatData";
import { resourceForm } from "../../../resources/resourceVN";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import instance from "../../../api/axios";

export default function ListProduct({ setLoadHeader }) {
  const [pageSize, setPageSize] = useState(9);
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productHome, setProductHome] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount(count + 1);
  };

  const navigate = useNavigate();

  //state carts
  const [carts, setCarts] = useState([]);

  // Nội dung của toast message
  const notify = () =>
    toast.success("Đã thêm sản phẩm vào giỏ hàng.", {
      position: "top-center",
    });

  // gọi API lấy thông tin tất cả danh mục
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

  //tính toán chỉ mục sản phẩm bắt đầu và chỉ mục sản phẩm kết thúc
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const displayedProduct = productHome.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Lấy thông tin tất cả cart trong database
  const getAllCart = async () => {
    try {
      const response = await instance.get("carts");
      setCarts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Lấy thông tin tất cả sản phẩm trong database
  const getAllProduct = async () => {
    try {
      const response = await instance.get(`products`);
      console.log(response);

      if (categoryId === 0) {
        setProductHome(response.data);
      } else {
        const listProducts = response.data.filter(
          (product) => product.category_id === categoryId
        );
        setProductHome(listProducts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCart();
  }, []);

  useEffect(() => {
    getAllProduct();
  }, [categoryId]);

  // Xử lý chức năng thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (id) => {
    // Check if user is logged in
    const userLogin = JSON.parse(localStorage.getItem("userLogin"));
    if (!userLogin) {
      // Hãy đăng nhập để mua hàng
      Modal.warning({
        title: "Thông Báo",
        content: "Bạn Hãy Đăng Nhập Để Mua Hàng",
        onOk() {
          navigate("/login");
        },
        onCancel() {
          navigate("/");
        },
        cancelText: "Hủy Bỏ",
        okText: "Đồng Ý",
      });

      return;
    }

    try {
      // Tìm giỏ hàng của người dùng, bạn cần thay đổi userId tương ứng với người dùng hiện tại
      const userId = userLogin.id;

      const userCart = carts.find((cart) => cart.userId === userId); // Tìm kiếm id của user trong giỏ hang

      if (userCart) {
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        const existingProduct = userCart.cartDetails.find(
          (item) => item.productId === id
        );

        if (existingProduct) {
          // Nếu sản phẩm đã tồn tại, tăng số lượng
          existingProduct.quantity += 1;
        } else {
          // Nếu sản phẩm chưa tồn tại, thêm sản phẩm vào giỏ hàng
          userCart.cartDetails.push({
            productId: id,
            quantity: 1,
          });
        }

        // Cập nhật giỏ hàng trên server
        await instance.put(`carts/${userCart.id}`, userCart);
        setLoadHeader();
        notify();
      } else {
        // Nếu người dùng chưa có giỏ hàng, tạo giỏ hàng mới.
        const newCart = {
          userId: userId,
          cartDetails: [],
        };

        // Gửi yêu cầu POST để tạo giỏ hàng mới
        const response = await instance.post("carts", newCart);

        // Cập nhật danh sách giỏ hàng trên client
        setCarts([...carts, response.data]);
        localStorage.setItem("cartUser", JSON.stringify(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const gridStyle = {
    width: "100%",
    height: "5px",
    textAlign: "center",
    lineHeight: "3px",
    color: "#e94560",
    fontSize: "16px",
  };
  return (
    <>
      <ToastContainer />
      <section
        style={{ backgroundColor: "#ececec" }}
        className=" shop pt-4 background heading "
      >
        <div className="container">
          <div className=" d_flex">
            <div className="category m-0">
              <div className="chead d_flex">
                <h1 style={{ fontSize: 30 }}>Danh mục</h1>
              </div>

              {category.map((value) => (
                <div
                  onClick={() => getCategoryId(value.id)}
                  style={
                    categoryId === value.id
                      ? { backgroundColor: "#cfcfcf", color: "#000" }
                      : {}
                  }
                  className="box f_flex"
                  key={value.id}
                >
                  <img
                    style={{ width: "50px" }}
                    src={value.category_image}
                    alt=""
                  />
                  <span>{value.category_name}</span>
                </div>
              ))}
              <div
                style={
                  categoryId === 0
                    ? { backgroundColor: "#cfcfcf", color: "#000" }
                    : {}
                }
                onClick={() => getCategoryId(0)}
                className="box box2 "
              >
                <span style={{ fontSize: 16 }}>{resourceForm.viewAll}</span>
              </div>
            </div>

            <div className="contentWidth">
              <div className="product-content  grid1">
                {displayedProduct.map((shopItems) => (
                  <div className="box" key={shopItems.id}>
                    <div className="product mtop">
                      <div className="img">
                        <span className="discount">
                          {shopItems.discount}% Off
                        </span>
                        <Image
                          className="img_dt"
                          src={shopItems.product_image}
                          alt=""
                        />
                        <Link to={`/description/${shopItems.id}`}>
                          <Card>
                            <Card.Grid style={gridStyle}>
                              Chi Tiết Sản Phẩm
                            </Card.Grid>
                          </Card>
                        </Link>

                        <div className="product-like">
                          <label>{count}</label> <br />
                          <i
                            className="fa-regular fa-heart"
                            onClick={increment}
                          ></i>
                        </div>
                      </div>
                      <div className="product-details ">
                        <h2 className="text-xl mb-2 mt-3">
                          {shopItems.product_name}
                        </h2>
                        <div className="rate">
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                        </div>
                        <div className="price ">
                          <h4 style={{ fontSize: 15 }}>
                            {formatMoney(+shopItems.price)}{" "}
                          </h4>
                          <button
                            onClick={() => handleAddToCart(shopItems.id)}
                            className="fa-plus-btn"
                          >
                            <i className="fa fa-plus "></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4 ">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={productHome.length}
                  onChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
