import { Card, Button, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function LoginWarning({ onProceed }) {
  return (
    <Card
      style={{
        maxWidth: "400px",
        textAlign: "center",
        borderRadius: "8px",
        background: "linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%)",
        animation: "fadeIn 0.5s ease-in-out",
      }}
    >
      <Title level={4}>Warning</Title>
      <Paragraph>
        This section is for admin use only. Proceed only if you have the
        credentials.
      </Paragraph>
      <Button
        type="primary"
        onClick={onProceed}
        style={{
          borderRadius: "8px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        className="custom-button"
      >
        Proceed
      </Button>

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
    </Card>
  );
}
