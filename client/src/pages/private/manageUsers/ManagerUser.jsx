import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Image, Input, Table } from "antd";
import {
  changeActiveUser,
  getUser,
} from "../../../redux/userSlice/userSlice";
import { formatDate } from "../../../utils/formatData";
import RoleButton from "../../../redux/userSlice/roleButton";

export default function ManagerUser() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.data);
  const isLoading = useSelector((state) => state.user.isLoadingChange);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getUser(searchText));
  }, [isLoading]);

  useEffect(() => {
    dispatch(getUser(searchText));
  }, [searchText]);

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      width: "5vw",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "User Name",
      dataIndex: "user_name",
      key: "user_name",
      width: "15vw",
    },
    {
      title: "Avatar",
      dataIndex: "image",
      key: "image",
      width: "10vw",
      render: (link) => <Image width={70} src={link} alt="image" />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "15vw",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "15vw",
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: "10vw",
      render: (_, dateOfBirth) => (
        <span>{formatDate(dateOfBirth.dateOfBirth)}</span>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: "5vw",
      render: (_, g) => (
        <span>{g.gender == 0 ? "Nam" : g.gender == 1 ? "Nữ" : "Khác"}</span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "5vw",
      render: (_, user) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {user.role != 0 ? (
            <Button danger onClick={() => dispatch(changeActiveUser(user))}>
              {user.active ? "Khóa" : "Mở"}
            </Button>
          ) : (
            // Nếu là role 0 (admin), không hiển thị nút action
            <></>
          )}
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "5vw",
      render: (_, user) => <RoleButton user={user} />,
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
        dataSource={users}
        pagination={{ pageSize: 5 }}
        rowKey={(record) => record.id}
      />
    </>
  );
}
