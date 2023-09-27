import React from "react";
import { BellOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";

const items = [
  {
    label: <a href="https://www.antgroup.com">1st menu item</a>,
    key: "0",
  },
  {
    label: <a href="https://www.aliyun.com">2nd menu item</a>,
    key: "1",
  },
  {
    type: "divider",
  },
  {
    label: "3rd menu item",
    key: "3",
  },
];
export default function Notification() {
  return (
    <>
      <Dropdown
        menu={{
          items,
        }}
        trigger={["click"]}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <BellOutlined  style={{fontSize:20}}/>
            
          </Space>
        </a>
      </Dropdown>
    </>
  );
}
