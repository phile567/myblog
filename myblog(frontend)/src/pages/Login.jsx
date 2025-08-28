import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SiteHeader from "../components/SiteHeader";
import { App } from "antd";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("请填写用户名和密码");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Login页面 - 开始登录:", formData.username);

      const userData = await login(formData.username, formData.password);

      console.log("Login页面 - 登录成功:", userData);
      console.log("Login页面 - 用户状态:", userData.status);

      // 登录成功后跳转
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login页面 - 登录失败:", error);

      let errorMessage = "登录失败";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="auth">
          <h1 style={{ margin: 0 }}>登录</h1>
          <p className="muted" style={{ marginTop: 6 }}>欢迎回来</p>

          {error && (
            <div
              className="error"
              style={{
                padding: "12px",
                background: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: "6px",
                color: "#dc2626",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">
            <div className="field">
              <label htmlFor="username">用户名</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="input"
                placeholder="请输入用户名"
                disabled={loading}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">密码</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="请输入密码"
                disabled={loading}
                required
              />
            </div>

            <div className="actions">
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "登录中..." : "登录"}
              </button>
              <Link to="/register" className="btn ghost">
                注册账号
              </Link>
            </div>
          </form>
        </section>

        <footer className="footer">© {new Date().getFullYear()} MyBlog</footer>
      </main>
    </>
  );
}