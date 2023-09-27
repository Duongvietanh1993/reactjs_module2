import React, { useEffect, useState } from "react";
import { formatMoney } from "./../../../utils/formatData";
import { Button, Image, Input, Modal, notification } from "antd";
import instance from "../../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { DatabaseOutlined } from "@ant-design/icons";
const { TextArea } = Input;

export default function Cart({ setLoadHeader }) {
  const [carts, setCarts] = useState([]);
  const [orderName, setOrderName] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const navigate = useNavigate();

  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  // Tính tổng số tiền
  const totalAmount = () => {
    return carts.reduce((prev, curent) => {
      return prev + curent.datas.price * curent.quantity;
    }, 0);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleDeleteCart = async (id) => {
    try {
      // Lấy ra tất cả giỏ hàng trong db
      const response = await instance.get("carts");

      const userCart = response.data.find(
        (user) => user.userId === userLogin.id
      );
      if (userCart) {
        // Tìm kiếm giỏ hàng của user đang đăng nhập
        const cartIndex = userCart.cartDetails.filter(
          (cart) => cart.productId !== id
        );
        // Cập nhật giỏ hàng của người dùng với danh sách sản phẩm đã lọc
        userCart.cartDetails = cartIndex;

        // Cập nhật giỏ hàng trên server
        await instance.put(`carts/${userCart.id}`, userCart);

        // Cập nhật lại state với danh sách sản phẩm sau khi xóa
        getAllCart();
        setLoadHeader();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmDelete = (id) => {
    Modal.confirm({
      title: "Xác Nhận",
      content: "Bạn có muốn xóa",
      onOk() {
        handleDeleteCart(id);
      },
      cancelText: "Hủy Bỏ",
      okText: "Đồng Ý",
    });
  };

  // Lấy thông tin tất cả giỏ hàng
  const getAllCart = async () => {
    try {
      // Lấy ra tất cả giỏ hàng trong db
      const response = await instance.get("carts");
      // Tìm kiếm giỏ hàng của user đang đăng nhập
      const cartUser = await response.data.find(
        (cart) => cart.userId === userLogin.id
      );

      if (cartUser) {
        const updatedCarts = await Promise.all(
          cartUser.cartDetails.map(async (cartItem) => {
            // Lấy thông tin sản phẩm dựa trên productId
            const product = await instance.get(
              `products/${cartItem.productId}`
            );
            const datas = product.data;
            return { ...cartItem, datas };
          })
        );
        setCarts(updatedCarts);
        setLoadHeader();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCart();
  }, []);

  // Hàm xử lý tăng
  const handleIncrease = async (id) => {
    try {
      // Lấy ra tất cả giỏ hàng trong db
      const response = await instance.get("carts");

      const userCart = response.data.find(
        (user) => user.userId === userLogin.id
      );
      if (userCart) {
        // Tìm kiếm giỏ hàng của user đang đăng nhập
        const cartIndex = userCart.cartDetails.findIndex(
          (cart) => cart.productId === id
        );
        if (cartIndex !== -1) {
          // Tăng số lượng sản phẩm trong giỏ hàng
          userCart.cartDetails[cartIndex].quantity += 1;

          // Cập nhật giỏ hàng trên server
          await instance.put(`carts/${userCart.id}`, userCart);

          getAllCart(); // Load lại dữ liệu
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Hàm xử lý giảm
  const handleDecrease = async (id) => {
    try {
      // Lấy ra tất cả giỏ hàng trong db
      const response = await instance.get("carts");

      const userCart = response.data.find(
        (user) => user.userId === userLogin.id
      );
      if (userCart) {
        // Tìm kiếm giỏ hàng của user đang đăng nhập
        const cartIndex = userCart.cartDetails.findIndex(
          (cart) => cart.productId === id
        );
        if (cartIndex !== -1) {
          if (userCart.cartDetails[cartIndex].quantity > 1) {
            // Giảm số lượng sản phẩm trong giỏ hàng
            userCart.cartDetails[cartIndex].quantity -= 1;

            // Cập nhật giỏ hàng trên server
            await instance.put(`carts/${userCart.id}`, userCart);

            getAllCart(); // Load lại dữ liệu
          } else {
            handleDeleteCart(id);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = async () => {
    try {
      // Xóa dữ liệu cartUser trên local
      localStorage.removeItem("cartUser");

      // Lấy ngày tháng năm đặt hàng
      const currentDate = new Date();
      const orderDate = currentDate.toLocaleString();

      // Kiểm tra name address note không được để trống
      if (orderName === "") {
        notification.error({
          message: "Cảnh Báo",
          description: "Vui lòng nhập tên người đặt hàng hàng",
          placement: "top",
        });

        return;
      }
      if (orderAddress === "") {
        notification.error({
          message: "Cảnh Báo",
          description: "Vui lòng nhập địa chỉ giao hàng",
          placement: "top",
        });

        return;
      }
          if (phone === "") {
        notification.error({
          message: "Cảnh Báo",
          description: "Vui lòng nhập số điện thoại giao hàng",
          placement: "top",
        });

        return;
      }

      // Gửi dữ liệu lên API với trường tên đơn hàng và ngày đặt hàng
      const payload = {
        orderName: orderName,
        orderAddress: orderAddress,
        orderNote: orderNote,
        orderPhone: phone,
        total: totalAmount(),
        date: orderDate,
        status: false,
        carts: carts,
        userIdCart: userLogin.id,
      };

      // Kiểm tra trùng lặp cho orderName
      const checkDuplicate = await instance.get("orders", {
        params: {
          orderName: orderName,
        },
      });

      if (checkDuplicate.data.length > 0) {
        notification.warning({
          message: "Cảnh Báo",
          description: "Đã trùng tên đơn hàng",
          placement: "top",
        });

        return;
      }

      // Chuyển hướng trang về trang chủ sau khi hoàn thành thanh toán
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có chắc chắn muốn thanh toán",
        onOk: async () => {
          try {
            // Gửi yêu cầu tạo đơn hàng
            const response = await instance.post("orders", payload);

            if (response.status === 201) {
              setOrderName("");
              setOrderAddress("");
              setPhone("");
              setOrderNote("");
              setCarts([]);

              // Lấy ra danh sách cart
              const userCarts = await instance.get("carts");
              // dúng userLogin để lấy ra id của cart

              const cartId = userCarts.data.find(
                (cart) => cart.userId === userLogin.id
              ).id;
              // chuyển id đấy vào url
              await instance.patch(`carts/${cartId}`, {
                cartDetails: [],
              });
            }
            setLoadHeader();
            navigate("/");
          } catch (error) {
            console.log(error);
            // Xử lý lỗi khi gửi yêu cầu tạo đơn hàng
          }
        },
        cancelText: "Hủy Bỏ",
        okText: "Thanh Toán",
      });
    } catch (error) {
      console.log(error);
      // Xử lý lỗi khác khi xử lý thanh toán
    }
  };

  return (
    <>
      <div className="container mt-4 ">
        <div className="flex items-center justify-between">
          <h1 className="text-center text-4xl">Cart</h1>

          <Link to="/" className="btn  btn-outline-dark mx-4">
            <i className="fa fa-arrow-left"></i> Quay Lại Trang Chủ
          </Link>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="flex justify-between my-4">
            <div>
              <div className="card_user" style={{ width: 1050 }}>
                <div className="card-header py-3">
                  <h5 className="mb-0 text-2xl">Item List</h5>
                </div>
                <div>
                  {carts.map((cart) => {
                    return (
                      <div key={cart.datas.id} style={{ with: "100%" }}>
                        <div className=" flex justify-between mx-20">
                          <div
                            style={{ width: "500px" }}
                            className="flex items-center justify-start gap-10 "
                          >
                            <div
                              className="flex justify-start"
                              data-mdb-ripple-color="light"
                            >
                              <Image
                                src={cart.datas.product_image}
                                alt={cart.datas.title}
                                width={150}
                              />
                            </div>
                            <div>
                              <strong>{cart.datas.product_name}</strong>
                            </div>
                          </div>

                          <div
                            style={{ width: "350px" }}
                            className="flex items-center justify-between"
                          >
                            <div className="flex gap-3 items-center ">
                              <Button
                                onClick={() => handleDecrease(cart.datas.id)}
                                className=" border-none"
                              >
                                <i className="fas fa-minus"></i>
                              </Button>

                              <span style={{ fontSize: "16px" }}>
                                {cart.quantity}
                              </span>

                              <Button
                                onClick={() => handleIncrease(cart.datas.id)}
                                className="border-none "
                              >
                                <i className="fas fa-plus"></i>
                              </Button>
                            </div>

                            <p className="flex">
                              <strong>
                                <span className="text-muted">
                                  {cart.quantity}
                                </span>{" "}
                                x {formatMoney(cart.datas.price)}
                              </strong>
                            </p>
                            <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                              <DatabaseOutlined /> {cart.datas.quantity}
                            </p>
                            <Button
                              onClick={() => handleConfirmDelete(cart.datas.id)}
                              style={{ background: "#da2d4a", color: "white" }}
                            >
                              Xóa
                            </Button>
                          </div>
                        </div>

                        <hr className="my-4" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card_user w-96">
                <div className="card-header py-3 ">
                  <h5 className="mb-0 text-2xl">Order Summary</h5>
                </div>
                <div className="card-body">
                  <label
                    htmlFor="orderNameInput"
                    className="mb-2"
                    style={{ fontSize: "16px" }}
                  >
                    {" "}
                    Tên Đơn Hàng:
                  </label>
                  <Input
                    id="orderNameInput"
                    type="text"
                    value={orderName}
                    onChange={(e) => setOrderName(e.target.value.trim())}
                    placeholder="Tên Người Đặt"
                  />

                  <label
                    htmlFor="orderAddressInput"
                    className="mb-2 mt-4"
                    style={{ fontSize: "16px" }}
                  >
                    {" "}
                    Địa Chỉ Giao Hàng:
                  </label>
                  <Input
                    id="orderAddressInput"
                    type="text"
                    value={orderAddress}
                    onChange={(e) => setOrderAddress(e.target.value.trim())}
                    placeholder="Địa Chỉ Giao Hàng"
                  />

                  <label
                    htmlFor="orderPhone"
                    className="mb-2 mt-4"
                    style={{ fontSize: "16px" }}
                  >
                    {" "}
                    Số Điện Thoại:
                  </label>
                  <Input
                    id="orderPhone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.trim())}
                    placeholder="Số điện thoại liên hệ"
                  />

                  <label
                    htmlFor="orderNoteInput"
                    className="mb-2 mt-4"
                    style={{ fontSize: "16px" }}
                  >
                    {" "}
                    Chú Thích:
                  </label>
                  <TextArea
                    id="orderNoteInput"
                    type="text"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value.trim())}
                    placeholder="Địa Chỉ Giao Hàng"
                  />
                </div>

                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Tổng Giá Sản Phẩm:
                      <span>{formatMoney(totalAmount())}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Phí Shipping:
                      <span>{formatMoney(30000)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3 text-xl">
                      <div>
                        <strong>Tổng Tiền Thanh Toán:</strong>
                      </div>
                      <span>
                        <strong>{formatMoney(totalAmount() + 30000)}</strong>
                      </span>
                    </li>
                  </ul>

                  <Button
                    onClick={handleCheckout}
                    type="primary"
                    style={{ width: "100%", fontSize: "16px" }}
                  >
                    Thanh Toán
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
