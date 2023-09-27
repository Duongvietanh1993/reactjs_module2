import { Input, Table, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getOrder } from "../../../redux/orderSlice/orderSlice";
import { formatMoney } from "../../../utils/formatData";
import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";
import instance from "../../../api/axios";

export default function MyOrder() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState("");

  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
console.log(userLogin);
  const orderFind = async () => {
    // Lấy ra tất cả order trong
    const response = await instance.get("orders");
    console.log(response);
    // dùng userLogin để lấy ra id của cart
    const userOrder = response.data.filter((order) => order.userIdCart == userLogin.id);
console.log("sssssssssssss",userOrder);
    if (userOrder) {
      const orderId = userOrder.id;
      console.log(orderId);
      setOrders(userOrder); // Cập nhật giá trị của orders với đơn hàng tìm thấy
    } else {
      notification.warning({
        message:"Thông Báo",
        description:"Không có đơn hàng khởi tạo"
      })
    }
  };

  useEffect(() => {
    orderFind();
  }, []);
  useEffect(() => {
    dispatch(getOrder(searchText));
  }, [searchText]);

  //table
  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      width: "5vw",
      sorter: (a, b) => a.id - b.id,
    },

    {
      title: "Tên Người Đặt Hàng",
      dataIndex: "orderName",
      key: "orderName",
      width: "11vw",
    },

    {
      title: "Thời Gian Đặt Hàng",
      dataIndex: "date",
      key: "date",
      width: "10vw",
      render: (_, date) => <span>{date.date}</span>,
    },
    {
      title: "Số Điện Thoại Giao Hàng",
      dataIndex: "orderPhone",
      key: "orderPhone",
      width: "15vw",
    },
    {
      title: "Địa Chỉ Giao Hàng",
      dataIndex: "orderAddress",
      key: "orderAddress",
      width: "20vw",
    },
    {
      title: "Tổng Thanh Toán",
      dataIndex: "total",
      key: "total",
      width: "8vw",
      render: (_, total) => <span>{formatMoney(total.total)}</span>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      width: "9vw",
      render: (_, sta) => (
        <div>
          {sta.status ? (
            <span className="text-green-600">Đã Được Xác Nhận</span>
          ) : (
            <span className="text-red-500">Chưa Được Xác Nhận</span>
          )}
        </div>
      ),
    },
  ];


  return (
    <>
      <div className="container">
        <div className="text-3xl text-center mt-4">Lịch Sử Mua Hàng</div>
        <div className="flex justify-start mt-2">
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Mời nhập tên tìm kiếm"
            className="w-96"
          ></Input>
        </div>
        <Table
          columns={columns}
          rowKey={(record) => record.id}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <div className="text-left text-xl mb-3">Chi Tiết Đơn Hàng</div>
                <table className="table table-hover table-striped table-bordered text-center">
                  <tr>
                    <th>#</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Minh Họa</th>
                    <th>Số Lượng</th>
                    <th>Giá Tiền Sản Phẩm</th>
                  </tr>
                  <tbody>
                    {record.carts.map((cart) => (
                      <tr key={cart.productId}>
                        <td className="align-middle">{cart.productId}</td>
                        <td className="align-middle">
                          {cart.datas.product_name}
                        </td>
                        <td>
                          <img
                            width={100}
                            className="m-auto"
                            src={cart.datas.product_image}
                          />
                        </td>
                        <td className="align-middle">{cart.quantity}</td>
                        <td className="align-middle">
                          {formatMoney(+cart.datas.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <CaretDownOutlined
                  className="text-xl"
                  onClick={(e) => onExpand(record, e)}
                />
              ) : (
                <CaretRightOutlined
                  className="text-xl"
                  onClick={(e) => onExpand(record, e)}
                />
              ),
          }}
          expandIconColumnIndex={6}
          dataSource={orders}
        />
      </div>
    </>
  );
}
