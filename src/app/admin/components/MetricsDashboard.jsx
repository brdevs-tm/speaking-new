"use client";

import { useState, useEffect } from "react";
import { Card, Typography, Row, Col, Statistic, Spin, Table } from "antd";
import {
  UserOutlined,
  EyeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Title, Text } = Typography;

export default function MetricsDashboard({ token, setError }) {
  const [metrics, setMetrics] = useState({
    total_users: 0,
    total_visits: 0,
    average_time_spent: 0,
    recent_visits: [],
    user_durations: [],
  });
  const [loading, setLoading] = useState(false);
  const API_URL = "https://speaking-app.onrender.com";

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/speaking/metrics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setMetrics(data);
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
    fetchMetrics();
  }, [token, setError]);

  const columns = [
    { title: "Visit ID", dataIndex: "id", key: "id" },
    { title: "User ID", dataIndex: "user_id", key: "user_id" },
    { title: "Device ID", dataIndex: "device_id", key: "device_id" },
    { title: "Page", dataIndex: "page", key: "page" },
    { title: "Timestamp", dataIndex: "timestamp", key: "timestamp" },
    { title: "Duration (s)", dataIndex: "duration", key: "duration" },
  ];

  const chartData = metrics.user_durations.map((user, index) => ({
    name: user.user_id,
    duration: user.total_duration,
  }));

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
          Admin Metrics Dashboard
        </Title>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={8}>
            <Card
              style={{
                borderRadius: "8px",
                background: "linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%)",
                animation: "fadeIn 0.5s ease-in-out 0.1s",
              }}
            >
              <Statistic
                title="Total Users"
                value={metrics.total_users}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
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
              <Statistic
                title="Total Visits"
                value={metrics.total_visits}
                prefix={<EyeOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
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
              <Statistic
                title="Avg. Time Spent (s)"
                value={metrics.average_time_spent}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
        </Row>

        {/* User Duration Chart */}
        <Title
          level={4}
          style={{
            marginBottom: "16px",
            color: "#1F1F1F",
            animation: "fadeIn 0.5s ease-in-out 0.4s",
          }}
        >
          Time Spent per User
        </Title>
        <div style={{ height: "300px", marginBottom: "24px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                label={{ value: "User ID", position: "bottom" }}
              />
              <YAxis
                label={{
                  value: "Duration (s)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="duration" stroke="#1890ff" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Visits Table */}
        <Title
          level={4}
          style={{
            marginBottom: "16px",
            color: "#1F1F1F",
            animation: "fadeIn 0.5s ease-in-out 0.5s",
          }}
        >
          Recent Visits
        </Title>
        <Table
          dataSource={metrics.recent_visits}
          columns={columns}
          rowKey="id"
          bordered
          pagination={false}
          style={{ animation: "fadeIn 0.5s ease-in-out 0.6s" }}
        />

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
        `}</style>
      </div>
    </Spin>
  );
}
