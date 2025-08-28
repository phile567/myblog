import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntdApp, theme } from "antd";
import { AuthProvider } from "./context/AuthContext";
import "antd/dist/reset.css";
import "./styles/blog.css";
import App from "./App"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: { colorPrimary: "#0ea5e9", borderRadius: 8 },
          }}
        >
          <AntdApp>
            <App /> 
          </AntdApp>
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);