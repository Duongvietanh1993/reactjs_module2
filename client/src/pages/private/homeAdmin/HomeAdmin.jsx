import React from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import { Progress, Space } from "antd";
const twoColors = {
  "0%": "#108ee9",
  "100%": "#87d068",
};
const conicColors = {
  "0%": "#87d068",
  "50%": "#ffe58f",
  "100%": "#ffccc7",
};

export default function HomeAdmin() {
  return (
    <>
      <div>
        <div
          style={{ marginTop: "20px", marginBottom: "10px" }}
          className="text-3xl"
        >
          Biểu Đồ Tăng Trưởng
        </div>
        <Row gutter={16}>
          <Col span={12}>
            <Card bordered={false}>
              <Statistic
                title="Active"
                value={11.28}
                precision={2}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false}>
              <Statistic
                title="Idle"
                value={9.3}
                precision={2}
                valueStyle={{
                  color: "#cf1322",
                }}
                prefix={<ArrowDownOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: 16,
          marginTop: "80px",
          height: "90%",
        }}
      >
        <div className="text-3xl mb-3">Biểu Đồ Tăng Trưởng</div>
        <Progress percent={99.9} strokeColor={twoColors} />
        <Progress
          percent={99.9}
          status="active"
          strokeColor={{
            from: "#108ee9",
            to: "#87d068",
          }}
        />
        <Space
          wrap
          style={{ marginTop: "70px", scale: "2" }}
          className="flex justify-center gap-24"
        >
          <Progress type="circle" percent={90} strokeColor={twoColors} />
          <Progress type="circle" percent={100} strokeColor={twoColors} />
          <Progress type="circle" percent={93} strokeColor={conicColors} />
        </Space>
        <div
          className="flex justify-center gap-36"
          style={{ marginTop: "50px" }}
        >
          <div className="text-3xl mb-3">Biểu Đồ Tăng Trưởng</div>
          <div className="text-3xl mb-3">Biểu Đồ Tăng Trưởng</div>
          <div className="text-3xl mb-3">Biểu Đồ Tăng Trưởng</div>
        </div>
      </div>
    </>
  );
}
