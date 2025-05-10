"use client";

import { useRouter } from "next/navigation";
import { Button, Typography, Row, Col } from "antd";
import {
  MessageOutlined,
  BookOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function LandingPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "calc(100vh - 112px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          height: "64px",
          background: "linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          IELTS Pro
        </Title>
        <Title
          level={2}
          style={{ flex: 1, textAlign: "center", margin: 0, color: "#fff" }}
        >
          IELTS Speaking Practice
        </Title>
      </header>

      {/* Main Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
        }}
      >
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={8}>
            <Button
              type="primary"
              size="large"
              icon={<MessageOutlined />}
              onClick={() => router.push("/part/part1")}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                height: "auto",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="custom-button"
            >
              Part 1
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button
              type="primary"
              size="large"
              icon={<BookOutlined />}
              onClick={() => router.push("/part/part2")}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                height: "auto",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="custom-button"
            >
              Part 2
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button
              type="primary"
              size="large"
              icon={<QuestionCircleOutlined />}
              onClick={() => router.push("/part/part3")}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                height: "auto",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="custom-button"
            >
              Part 3
            </Button>
          </Col>
        </Row>
      </div>

      {/* Footer */}
      <footer
        style={{
          height: "48px",
          background: "linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.1)",
          flexShrink: 0,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Text style={{ color: "#fff", fontSize: "14px" }}>
          © 2025 IELTS Speaking Practice
        </Text>
      </footer>

      {/* Inline CSS for button hover animation */}
      <style jsx global>{`
        .custom-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  );
}
