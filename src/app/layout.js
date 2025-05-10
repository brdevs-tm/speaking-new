import { ConfigProvider } from "antd";
import "antd/dist/reset.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1890ff",
              borderRadius: 8,
              fontFamily:
                "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
              colorBgBase: "#f0f2f5",
            },
            components: {
              Button: {
                colorPrimaryHover: "#40a9ff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
              Card: {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
            },
          }}
        >
          <div
            style={{
              minHeight: "100vh",
              background: "linear-gradient(135deg, #e6f0fa 0%, #f5f7fa 100%)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
          </div>
        </ConfigProvider>
      </body>
    </html>
  );
}
