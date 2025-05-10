"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  message,
  Spin,
} from "antd";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Dashboard({ token, setError }) {
  const [counts, setCounts] = useState({ part1: 0, part2: 0, part3: 0 });
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const API_URL = "https://speaking-app.onrender.com";

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/speaking/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setCounts(data);
          setError(null);
        } else {
          setError(data.detail);
        }
      } catch (err) {
        setError("Network error: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, [token, setError]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/speaking/${values.part}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: values.question }),
      });
      const data = await response.json();
      if (response.ok) {
        setError(null);
        form.resetFields();
        message.success(data.message);
        setCounts((prev) => ({
          ...prev,
          [values.part]: prev[values.part] + 1,
        }));
      } else {
        setError(data.detail);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading} size="large">
      <div style={{ padding: "24px" }}>
        <Title
          level={2}
          style={{
            marginBottom: "24px",
            color: "#1F1F1F",
            animation: "fadeIn 0.5s ease-in-out",
          }}
        >
          Admin Dashboard
        </Title>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={8}>
            <Card
              style={{
                borderRadius: "8px",
                background: "linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%)",
                animation: "fadeIn 0.5s ease-in-out 0.1s",
              }}
            >
              <Text style={{ fontSize: "16px", color: "#1F1F1F" }}>
                Part 1: {counts.part1} questions
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              style={{
                borderRadius: "8px",
                background: "linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%)",
                animation: "fadeIn 0.5s ease-in-out 0.2s",
              }}
            >
              <Text style={{ fontSize: "16px", color: "#1F1F1F" }}>
                Part 2: {counts.part2} questions
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              style={{
                borderRadius: "8px",
                background: "linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%)",
                animation: "fadeIn 0.5s ease-in-out 0.3s",
              }}
            >
              <Text style={{ fontSize: "16px", color: "#1F1F1F" }}>
                Part 3: {counts.part3} questions
              </Text>
            </Card>
          </Col>
        </Row>

        {/* Add Question Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: "600px", marginBottom: "24px" }}
        >
          <Form.Item
            name="part"
            label="Select Part"
            rules={[{ required: true, message: "Please select a part" }]}
          >
            <Select placeholder="Select a part" style={{ width: "200px" }}>
              <Option value="part1">Part 1</Option>
              <Option value="part2">Part 2</Option>
              <Option value="part3">Part 3</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true, message: "Please enter a question" }]}
          >
            <Input placeholder="Enter the question" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                borderRadius: "8px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="custom-button"
            >
              Add Question
            </Button>
          </Form.Item>
        </Form>

        {/* Inline CSS for animation */}
        <style jsx global>{`
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .custom-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
          }
        `}</style>
      </div>
    </Spin>
  );
}
