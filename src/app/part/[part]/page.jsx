"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Card, Typography, Space, Spin } from "antd";
import {
  ArrowLeftOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function PartPage() {
  const router = useRouter();
  const { part } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_URL = "https://speaking-app.onrender.com";
  const partTitle = part.charAt(0).toUpperCase() + part.slice(1);

  // Define generateDeviceId before using it
  const generateDeviceId = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  // Generate a unique device ID
  const deviceId =
    typeof window !== "undefined"
      ? localStorage.getItem("deviceId") || generateDeviceId()
      : "unknown";
  const userId = "anonymous"; // In a real app, this would come from user authentication

  // Track visit start time
  const [visitStartTime, setVisitStartTime] = useState(Date.now());

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("deviceId", deviceId);
    }

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/api/speaking/${part}?user_id=${userId}&device_id=${deviceId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setQuestions(data.questions || []);
        } else {
          console.error(data.detail);
        }
      } catch (err) {
        console.error("Network error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();

    // Track visit duration when the user leaves the page
    return () => {
      const duration = Math.floor((Date.now() - visitStartTime) / 1000); // Duration in seconds
      fetch(
        `${API_URL}/api/speaking/${part}?user_id=${userId}&device_id=${deviceId}&duration=${duration}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
    };
  }, [part, userId, deviceId, visitStartTime]);

  const handleSpeak = () => {
    if (questions.length === 0) return;
    const utterance = new SpeechSynthesisUtterance(
      questions[currentQuestionIndex]
    );
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      handleStop();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      handleStop();
    }
  };

  return (
    <Spin spinning={loading} size="large">
      <div
        style={{
          minHeight: "calc(100vh - 112px)",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
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
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <Title level={3} style={{ color: "#fff", margin: 0 }}>
            IELTS Pro
          </Title>
          <Title
            level={2}
            style={{ flex: 1, textAlign: "center", margin: 0, color: "#fff" }}
          >
            {partTitle} Questions
          </Title>
        </header>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: "600px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              animation: "fadeIn 0.5s ease-in-out",
            }}
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
            {questions.length > 0 ? (
              <>
                <Title
                  level={4}
                  style={{ textAlign: "center", marginBottom: "24px" }}
                >
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Title>
                <Text
                  style={{
                    fontSize: "18px",
                    display: "block",
                    textAlign: "center",
                    marginBottom: "24px",
                  }}
                >
                  {questions[currentQuestionIndex]}
                </Text>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "24px",
                  }}
                >
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={handleSpeak}
                    disabled={speaking}
                    style={{
                      borderRadius: "8px",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    className="custom-button"
                  >
                    Speak
                  </Button>
                  <Button
                    type="default"
                    icon={<StopOutlined />}
                    onClick={handleStop}
                    disabled={!speaking}
                    style={{
                      borderRadius: "8px",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    className="custom-button"
                  >
                    Stop
                  </Button>
                </Space>
                <Space style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    style={{
                      borderRadius: "8px",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    className="custom-button"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentQuestionIndex === questions.length - 1}
                    style={{
                      borderRadius: "8px",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    className="custom-button"
                  >
                    Next
                  </Button>
                </Space>
              </>
            ) : (
              <Text
                style={{
                  fontSize: "18px",
                  display: "block",
                  textAlign: "center",
                }}
              >
                No questions available for {partTitle}.
              </Text>
            )}
          </Card>
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
