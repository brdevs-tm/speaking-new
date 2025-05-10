"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Input,
  Form,
  message,
  Spin,
  ConfigProvider,
} from "antd";
import {
  DashboardOutlined,
  PlusOutlined,
  TableOutlined,
  UserOutlined,
  LockOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import MetricsDashboard from "./components/MetricsDashboard";
import AddQuestionForm from "./components/AddQuestionForm";
import QuestionTable from "./components/QuestionTable";
import LoginWarning from "../../components/LoginWarning";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function Admin() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
      setShowLogin(true);
    }
  }, []);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://speaking-app.onrender.com/api/auth/admin-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setToken(data.access_token);
        localStorage.setItem("adminToken", data.access_token);
        setError(null);
        setShowLogin(true);
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("adminToken");
    setError(null);
    setShowLogin(false);
    router.push("/");
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "add-questions",
      icon: <PlusOutlined />,
      label: "Add Questions",
    },
    {
      key: "view-questions",
      icon: <TableOutlined />,
      label: "View Questions",
    },
  ];

  return (
    <ConfigProvider componentConfig={{ Button: { wave: { disabled: true } } }}>
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <Header
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
        </Header>

        {/* Main Content */}
        <Spin spinning={loading} size="large">
          <div style={{ flex: 1, minHeight: "calc(100vh - 112px)" }}>
            {!showLogin ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "24px",
                }}
              >
                <div
                  style={{ maxWidth: "400px", width: "100%", padding: "24px" }}
                >
                  <Button
                    type="default"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push("/")}
                    style={{
                      marginBottom: "16px",
                      borderRadius: "8px",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    className="custom-button"
                  >
                    Back to Home
                  </Button>
                  <LoginWarning onProceed={() => setShowLogin(true)} />
                </div>
              </div>
            ) : !token ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "24px",
                }}
              >
                <div style={{ maxWidth: "400px", width: "100%" }}>
                  <Button
                    type="default"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push("/")}
                    style={{
                      marginBottom: "16px",
                      borderRadius: "8px",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    className="custom-button"
                  >
                    Back to Home
                  </Button>
                  <Title
                    level={2}
                    style={{ textAlign: "center", marginBottom: "24px" }}
                  >
                    Admin Login
                  </Title>
                  <Form form={form} layout="vertical" onFinish={handleLogin}>
                    <Form.Item
                      name="username"
                      label="Username"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your username",
                        },
                      ]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password",
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Password"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" block>
                        Login
                      </Button>
                    </Form.Item>
                  </Form>
                  {error && (
                    <Text
                      style={{
                        color: "red",
                        display: "block",
                        textAlign: "center",
                      }}
                    >
                      {error}
                    </Text>
                  )}
                </div>
              </div>
            ) : (
              <Layout style={{ minHeight: "100%" }}>
                <Sider
                  collapsible
                  collapsed={collapsed}
                  onCollapse={setCollapsed}
                  width={200}
                  breakpoint="lg"
                  collapsedWidth={80}
                  style={{
                    background:
                      "linear-gradient(180deg, #e6f0fa 0%, #d6e4ff 100%)",
                    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={(e) => setSelectedKey(e.key)}
                    style={{ height: "100%", borderRight: 0 }}
                    items={menuItems}
                  />
                </Sider>
                <Layout>
                  <Content
                    style={{
                      padding: "24px",
                      maxWidth: "1000px",
                      margin: "0 auto",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        type="default"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.push("/")}
                        style={{
                          borderRadius: "8px",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        className="custom-button"
                      >
                        Back to Home
                      </Button>
                      <Button
                        type="primary"
                        danger
                        onClick={handleLogout}
                        style={{
                          borderRadius: "8px",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        className="custom-button"
                      >
                        Logout
                      </Button>
                    </div>
                    {selectedKey === "dashboard" && (
                      <MetricsDashboard token={token} setError={setError} />
                    )}
                    {selectedKey === "add-questions" && (
                      <AddQuestionForm token={token} setError={setError} />
                    )}
                    {selectedKey === "view-questions" && (
                      <QuestionTable token={token} setError={setError} />
                    )}
                    {error && (
                      <Text
                        style={{
                          color: "red",
                          display: "block",
                          textAlign: "center",
                        }}
                      >
                        {error}
                      </Text>
                    )}
                  </Content>
                </Layout>
              </Layout>
            )}
          </div>
        </Spin>

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
          }}
        >
          <Text style={{ color: "#fff", fontSize: "14px" }}>
            © 2025 IELTS Speaking Practice
          </Text>
        </footer>

        {/* Inline CSS for hover effects */}
        <style jsx global>{`
          .custom-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}
