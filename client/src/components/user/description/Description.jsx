import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatMoney } from "../../../utils/formatData";
import { Image } from "antd";
import instance from "../../../api/axios";
import { ToastContainer, toast } from "react-toastify";

export default function Description({setLoadHeader}) {
  const [count, setCount] = useState(0);
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [carts, setCarts] = useState([]);

   // Nội dung của toast message
   const notify = () =>
   toast.success("Đã thêm sản phẩm vào giỏ hàng.", {
     position: "top-center",
   });

  const increment = () => {
    setCount(count + 1);
  };
  //goị API lấy thông tin chi tiết theo id
  const getProductById = () => {
    axios
      .get(`http://localhost:8000/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getProductById();


  }, []); // Lấy thông tin tất cả cart trong database
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
    <div>
       <ToastContainer />
      <div>
        <div className="container flex justify-start gap-2 mt-4">
          <div
            id="thongbao"
            className="alert alert-danger d-none face"
            role="alert"
          >
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
          <div className="card">
            <div className="container-fliud">
              <div className="wrapper">
                <div className="col-md-8">
                  <div className="preview-pic ">
                    <div className=" active">
                      <span className="discount">{product.discount}% Off</span>
                      <img src={product.product_image} />
                    </div>
                  </div>
                </div>
                <div className="details col-md-6" style={{ lineHeight: "2" }}>
                  <h3 className="product-title " style={{fontSize:"25px"}}>
                    {product.product_name}
                  </h3>
                  <div className="rating mb-4">
                    <div className="stars">
                      <span className="fa fa-star checked" />
                      <span className="fa fa-star checked" />
                      <span className="fa fa-star checked" />
                      <span className="fa fa-star" />
                      <span className="fa fa-star" />
                    </div>
                    <span className="review-no">999 reviews</span>
                  </div>

                  <small className="text-muted mt-3">
                    Giá cũ:{" "}
                    <s>
                      <span>
                      {formatMoney(+product.price)}
                       
                      </span>
                    </s>
                  </small>
                  <h4 className="price mt-1" style={{fontSize:"16px"}}>
                    Giá hiện tại: <span> {formatMoney(product.price-(product.price * product.discount / 100))}</span>
                  </h4>
                  <p className="vote mt-5">
                    <strong>100%</strong> hàng <strong>Chất lượng</strong>, đảm
                    bảo
                    <strong>Uy tín</strong>!
                  </p>

                  <h4 className="price mt-3 " style={{fontSize:"16px"}}>
                    Xuất xứ: <span>{product.from}</span>
                  </h4>
                  <h5 className="colors mt-3" style={{fontSize:"16px"}}>
                    colors:
                    <span className="color orange not-available" />
                    <span className="color green" />
                    <span className="color blue" />
                  </h5>

                  <div style={{fontSize:"16px"}} className="colors flex justify-between items-center w-40 mt-5">
                    Yêu Thích:
                    <i
                      onClick={increment}
                      className="fa-solid fa-heart  text-red-400 text-2xl"
                    >
                      <label>{count}</label>
                    </i>
                  </div>

                  <div className="action">
                    <button onClick={() => handleAddToCart(product.id)} className="add-to-cart btn btn-default">
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card_two">
            <div className="container-fluid">
              <h3 className=" mb-4" style={{fontSize:"25px"}}>Thông Số Kỹ Thuật</h3>
              <div className="row">
                <div className="col" style={{ whiteSpace: 'pre-wrap' ,fontSize:"15px"}}>{product.description}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card_one">
            <div className="container-fluid">
              <h3 className="text-xl" >Sản Phẩm Liên Quan</h3>
              <div className="row">
                <div className="col"></div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
