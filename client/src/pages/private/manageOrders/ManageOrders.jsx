import { Button, Input, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeActiveOrder,
  getOrder,
} from "../../../redux/orderSlice/orderSlice";
import { formatMoney } from "../../../utils/formatData";
import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";

export default function ManageOrders() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.data);
  const isLoading = useSelector((state) => state.order.isLoadingChange);
  const [searchText, setSearchText] = useState("");


  useEffect(() => {
    dispatch(getOrder(searchText));
  }, [isLoading]);

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
      title: "Tên Đơn Hàng",
      dataIndex: "orderName",
      key: "orderName",
      width: "8vw",
    },
    {
      title: "Thời Gian Đặt Hàng",
      dataIndex: "date",
      key: "date",
      width: "8vw",
      render: (_, date) => <span>{date.date}</span>,
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "orderPhone",
      key: "orderPhone",
      width: "8vw",
    },
    {
      title: "Tổng Thanh Toán",
      dataIndex: "total",
      key: "total",
      width: "8vw",
      render: (_, total) => <span>{formatMoney(total.total)}</span>,
    },
    {
      title: "Địa chỉ Giao Hàng",
      dataIndex: "orderAddress",
      key: "orderAddress",
      width: "10vw",
    },
    {
      title: "Ghi Chú",
      dataIndex: "orderNote",
      key: "orderNote",
      width: "10vw",
    },
   

    {
      title: "Action",
      dataIndex: "status",
      key: "status",
      width: "8vw",
      render: (_, order) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {order.status == false ? (
            <Button danger onClick={() => dispatch(changeActiveOrder(order))}>
              {order.active ? "Chờ Xác Nhận" : "Xác Nhận"}
            </Button>
          ) : (
            <span className="text-green-500">Đã Nhận Đơn</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-end">
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
                  <th>Giá Tiền</th>
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
                      <td className="align-middle">{formatMoney(+cart.datas.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <CaretDownOutlined className="text-xl" onClick={(e) => onExpand(record, e)} />
            ) : (
              <CaretRightOutlined className="text-xl" onClick={(e) => onExpand(record, e)} />
            ),
        }}
        expandIconColumnIndex={7}
        dataSource={orders}
        pagination={{ pageSize: 7 }}
      />
    </>
  );
}
