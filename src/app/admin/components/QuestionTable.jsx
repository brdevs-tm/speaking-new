"use client";

import { useState, useEffect } from "react";
import { Table, Button, Input, Collapse, message, Space, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function QuestionTable({ token, setError }) {
  const [questions, setQuestions] = useState({});
  const [editQuestion, setEditQuestion] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = "https://speaking-app.onrender.com";

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/speaking/all-questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          const grouped = data.reduce((acc, q) => {
            acc[q.part] = acc[q.part] || [];
            acc[q.part].push({ id: q.id, question: q.question });
            return acc;
          }, {});
          setQuestions(grouped);
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
    fetchQuestions();
  }, [token, setError]);

  const handleDelete = async (part, id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/speaking/${part}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setQuestions((prev) => ({
          ...prev,
          [part]: prev[part].filter((q) => q.id !== id),
        }));
        setError(null);
        message.success("Question deleted successfully");
      } else {
        setError(data.detail);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (part, id) => {
    if (!editValue) {
      setError("Please enter a new question");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/speaking/${part}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: editValue }),
      });
      const data = await response.json();
      if (response.ok) {
        setQuestions((prev) => ({
          ...prev,
          [part]: prev[part].map((q) =>
            q.id === id ? { ...q, question: editValue } : q
          ),
        }));
        setEditQuestion(null);
        setEditValue("");
        setError(null);
        message.success("Question updated successfully");
      } else {
        setError(data.detail);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = (part) => [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      responsive: ["md"],
    },
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      render: (text, record) =>
        editQuestion === record.id ? (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            style={{ width: "100%" }}
          />
        ) : (
          text
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        editQuestion === record.id ? (
          <Space>
            <Button
              type="primary"
              onClick={() => handleEdit(part, record.id)}
              style={{
                borderRadius: "8px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="custom-button"
            >
              Save
            </Button>
            <Button
              onClick={() => setEditQuestion(null)}
              style={{
                borderRadius: "8px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="custom-button"
            >
              Cancel
            </Button>
          </Space>
        ) : (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditQuestion(record.id);
                setEditValue(record.question);
              }}
              style={{
                borderRadius: "8px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="custom-button"
            />
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(part, record.id)}
              style={{
                borderRadius: "8px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="custom-button"
            />
          </Space>
        ),
    },
  ];

  const collapseItems = Object.entries(questions).map(([part, qs]) => ({
    key: part,
    label: `${part.toUpperCase()} Questions`,
    children: (
      <Table
        dataSource={qs}
        columns={columns(part)}
        rowKey="id"
        bordered
        pagination={false}
      />
    ),
    style: {
      background: "linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%)",
      borderRadius: "8px",
      marginBottom: "8px",
      animation: "fadeIn 0.5s ease-in-out",
    },
  }));

  return (
    <Spin spinning={loading} size="large">
      <div>
        <Collapse
          defaultActiveKey={["part1"]}
          style={{ marginBottom: "24px", background: "transparent" }}
          items={collapseItems}
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
          .custom-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
          }
        `}</style>
      </div>
    </Spin>
  );
}
