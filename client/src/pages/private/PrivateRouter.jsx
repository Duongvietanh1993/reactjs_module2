import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  DollarOutlined,
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Input, Layout, Menu, theme } from "antd";

import { NavLink, useNavigate } from "react-router-dom";
import Inbox from "../../components/admin/inbox/Inbox";
import Notification from "../../components/admin/notification/Notification";
import ShowAdminLogin from "../../components/admin/showAdminLogin/ShowAdminLogin";

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, to) {
  return {
    key,
    icon,
    label,
    to,
  };
}
const items = [
  getItem("Doanh Thu", "1", <PieChartOutlined />, "/admin"),
  getItem("Quản lý người dùng", "2", <UserOutlined />, "manager-user"),
  getItem("Quản lý sản phẩm", "3", <FileOutlined />, "manager-product"),
  getItem("Quản lý đơn hàng", "4", <DollarOutlined />, "manager-order"),
  getItem("Quản lý danh mục", "5", <FileOutlined />, "manager-categories"),
];

export default function PrivateRouter() {
  const isLogin = JSON.parse(localStorage.getItem("userLogin"))
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  return (
    <>
      {isLogin && isLogin.role === 0 ? (
        <div>
          <>
            <Layout
              style={{
                minHeight: "100vh",
              }}
            >
              <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
              >
                <div className="demo-logo-vertical mb-5 ">
                  <img className="demo-logo-vertical" src="https://firebasestorage.googleapis.com/v0/b/fir-login-with-e3ed6.appspot.com/o/logo%2FGroup%2010.png?alt=media&token=7b8ab723-241e-47f9-9f4c-28c0fcbc4334" alt="" />
                </div>
                <Menu
                  theme="dark"
                  defaultSelectedKeys={["1"]}
                  mode="inline"
                  onSelect={({ key }) => {
                    setSelectedKeys([key]);
                    const selectedItem = items.find((item) => item.key === key);
                    if (selectedItem) {
                      if (key === "1") {
                        setBreadcrumbItems([]);
                        navigate(selectedItem.to);
                      } else {
                        setBreadcrumbItems([selectedItem]);
                        navigate(selectedItem.to);
                      }
                    } else {
                      setBreadcrumbItems([]);
                    }
                  }}
                >
                  {items.map((item) => (
                    <Menu.Item key={item.key} icon={item.icon}>
                      <NavLink to={item.to}>{item.label}</NavLink>
                    </Menu.Item>
                  ))}
                </Menu>
              </Sider>
              <Layout>
                <Header
                  style={{
                    padding: 0,
                    paddingRight: 30,
                    background: colorBgContainer,
                  }}
                >
                  <div className="flex justify-end items-center gap-4">
                    <Inbox />
                    <Notification />
                    <ShowAdminLogin />
                  </div>
                </Header>
                <Content
                  style={{
                    margin: "0 16px",
                  }}
                >
                  <Breadcrumb
                    style={{
                      margin: "16px 0",
                    }}
                  >
                    <Breadcrumb.Item key="home">
                      <NavLink to="/admin">Home</NavLink>
                    </Breadcrumb.Item>
                    {breadcrumbItems.map((item) => (
                      <Breadcrumb.Item key={item.key} overlay={item.overlay}>
                        {item.label}
                      </Breadcrumb.Item>
                    ))}
                  </Breadcrumb>
                  <div
                    style={{
                      padding: 24,
                      paddingBottom: 0,
                      minHeight: 360,
                      background: colorBgContainer,
                    }}
                  >
                    <Outlet />
                  </div>
                </Content>
                <Footer
                  style={{
                    textAlign: "center",
                    paddingTop: 10,
                   
                  }}
                >
                  Ant Design ©2023 Created by Ant UED
                </Footer>
              </Layout>
            </Layout>
          </>
        </div>
      ) : (
        <Navigate to={"/login"} />
      )}
    </>
  );
}
