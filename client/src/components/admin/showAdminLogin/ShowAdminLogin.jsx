import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { KeyOutlined, PoweroffOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Modal } from "antd";
import "./ShowAdminLogin.css"

export default function ShowAdminLogin() {
  //lấy thông tin user đã đăng nhập
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("userLogin");
    navigate("/login");
  };
  // hàm xử lý đăng xuất
  const handleConfirmLogout = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn đăng xuất",
      onOk() {
        handleLogout();
      },
      cancelText: "Hủy bỏ",
      okText: "Đăng xuất",
    });
  };

  const items = [
    {
      key: "1",
      label: (
        <NavLink to="/profile">
          <UserOutlined className="pr-2 " />
          Thông tin cá nhân
        </NavLink>
      ),
    },
    {
      key: "2",
      label: (
        <NavLink to="/change-password">
          <KeyOutlined className="pr-2" />
          Đổi mật khẩu
        </NavLink>
      ),
    },
    {
      key: "3",
      label: (
        <a target="_blank" onClick={handleConfirmLogout}>
          <PoweroffOutlined className="pr-2" /> Đăng xuất
        </a>
      ),
    },
  ];
  return (
    <>
      <div className="icon f_flex width">
        {userLogin !== null ? (
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomRight"
            arrow
          >
            <Button className="border-none shadow-none">
              <div className="flex items-center gap-2 ">
                <img
                  src={userLogin.image}
                  alt=""
                  height={27}
                  width={27}
                  className="rounded-full"
                />
                <span className="text-black text-xl">
                  {userLogin.user_name}
                </span>
              </div>
            </Button>
          </Dropdown>
        ) : (
          <div>
            <NavLink to="/login">
              <i className="fa fa-user icon-circle"></i>
            </NavLink>
          </div>
        )}
      </div>
    </>
  );
}
