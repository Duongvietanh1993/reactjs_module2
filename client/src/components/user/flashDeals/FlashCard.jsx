import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formatMoney } from "./../../../utils/formatData";
import { ToastContainer, toast } from "react-toastify";
import instance from "../../../api/axios";
import { Image, Modal } from "antd";
import { Link } from "react-router-dom";

const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="next">
        <i className="fa-solid fa-caret-right"></i>
      </button>
    </div>
  );
};
const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="prev">
        <i className="fa-solid fa-caret-left"></i>
      </button>
    </div>
  );
};

export default function FlashCard({ setLoadHeader }) {
  const [count, setCount] = useState(0);
  const [productItems, setProductItems] = useState([]);
  const [carts, setCarts] = useState([]);

  const increment = () => {
    setCount(count + 1);
  };

  // Nội dung của toast message
  const notify = () =>
    toast.success("Đã thêm sản phẩm vào giỏ hàng.", {
      position: "top-center",
    });

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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCart();
  }, []);

  useEffect(() => {
    getAllProduct();
  }, []);

  // gọi API lấy thông tin tất cả sản phẩm
  const loadDataFlash = () => {
    fetch(`http://localhost:8000/products?`)
      .then((response) => response.json()) //ép kiểu json
      .then((response) => setProductItems(response)) // nơi có dữ liệu trả về
      .catch((error) => console.log(error)); // bắt lỗi
  };
  useEffect(() => {
    loadDataFlash();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  // Xử lý chức năng thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (id) => {
    // Check if user is logged in
    const userLogin = JSON.parse(localStorage.getItem("userLogin"));
    if (!userLogin) {
      // User is not logged in, show a message or redirect to the login page
      // For example:
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

  return (
    <>
    <ToastContainer/>
      <Slider {...settings}>
        {productItems.map((productItems) => (
          <div key={productItems.id} className="box">
            <div className="product">
              <div className="img">
                <span className="discount">{productItems.discount}% Off</span>
                <Image src={productItems.product_image} alt="" />
                <div className="product-like">
                  <label>{count}</label> <br />
                  <i className="fa-regular fa-heart" onClick={increment}></i>
                </div>
              </div>
              <div className="product-details ">
                <div className="flex justify-between items-center">
                  <h2 style={{fontSize:"18px"}}>{productItems.product_name}</h2>
                  <Link to={`/description/${productItems.id}`}>
                  <i className="fa-solid fa-eye text-2xl text-gray-400 mr-1"></i>
                  </Link>
                </div>

                <div className="rate">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                </div>
                <div className="price">
                  <h4 style={{ fontSize: 15 }}>
                    {formatMoney(formatMoney(productItems.price-(productItems.price * productItems.discount / 100)))}
                  </h4>

                  <button onClick={() => handleAddToCart(productItems.id)}>
                    <i className="fa fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </>
  );
}
