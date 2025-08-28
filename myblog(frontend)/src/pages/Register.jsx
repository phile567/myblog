import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../components/SiteHeader";
import { App } from "antd";

function isEmail(v) {
  if (!v) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function isPhone(v) {
  if (!v) return true;
  return /^\d{10,15}$/.test(v);
}

export default function Register() {
  const [values, setValues] = useState({
    username: "",
    password: "",
    confirm: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { message } = App.useApp();

  const setField = (name, val) => setValues((v) => ({ ...v, [name]: val }));

  const validate = () => {
    const e = {};
    const u = values.username.trim();
    const p = values.password;
    const c = values.confirm;
    const email = values.email.trim();
    const phone = values.phone.trim();

    if (!u) e.username = "用户名不能为空";
    if (!p || p.length < 6) e.password = "密码至少 6 位";
    if (c !== p) e.confirm = "两次输入的密码不一致";
    if (email && !isEmail(email)) e.email = "邮箱格式不正确";
    if (phone && !isPhone(phone)) e.phone = "手机号需为 10-15 位数字";
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;

    setLoading(true);
    try {
      const payload = {
        username: values.username.trim(),
        password: values.password,
        email: values.email.trim() || undefined,
        phone: values.phone.trim() || undefined,
      };
      const res = await axios.post("http://localhost:8080/api/user/register", payload);
      message.success(res.data?.message || "注册成功");
      navigate("/login", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "注册失败，请稍后再试";
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="auth">
          <h1 style={{ margin: 0 }}>注册</h1>
          <p className="muted" style={{ marginTop: 6 }}>创建你的账户</p>

          <form className="form" onSubmit={onSubmit}>
            {errors.form ? <div className="error">{errors.form}</div> : null}

            <div className="field">
              <label htmlFor="username">用户名</label>
              <input
                id="username"
                className="input"
                placeholder="请输入用户名"
                autoComplete="username"
                value={values.username}
                onChange={(e) => setField("username", e.target.value)}
              />
              {errors.username ? <div className="error">{errors.username}</div> : <div className="hint">必填</div>}
            </div>

            <div className="field">
              <label htmlFor="password">密码</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="请输入密码"
                autoComplete="new-password"
                value={values.password}
                onChange={(e) => setField("password", e.target.value)}
              />
              {errors.password ? <div className="error">{errors.password}</div> : <div className="hint">至少 6 位</div>}
            </div>

            <div className="field">
              <label htmlFor="confirm">确认密码</label>
              <input
                id="confirm"
                type="password"
                className="input"
                placeholder="请再次输入密码"
                autoComplete="new-password"
                value={values.confirm}
                onChange={(e) => setField("confirm", e.target.value)}
              />
              {errors.confirm ? <div className="error">{errors.confirm}</div> : null}
            </div>

            <div className="field">
              <label htmlFor="email">邮箱（可选）</label>
              <input
                id="email"
                className="input"
                placeholder="name@example.com"
                autoComplete="email"
                value={values.email}
                onChange={(e) => setField("email", e.target.value)}
              />
              {errors.email ? <div className="error">{errors.email}</div> : <div className="hint">可不填</div>}
            </div>

            <div className="field">
              <label htmlFor="phone">手机号（可选）</label>
              <input
                id="phone"
                className="input"
                placeholder="仅数字，10-15 位"
                inputMode="numeric"
                value={values.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
              {errors.phone ? <div className="error">{errors.phone}</div> : <div className="hint">可不填</div>}
            </div>

            <div className="actions">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "提交中..." : "注册"}
              </button>
              <Link to="/login" className="btn ghost">已有账号？去登录</Link>
            </div>
          </form>
        </section>

        <footer className="footer">© {new Date().getFullYear()} MyBlog</footer>
      </main>
    </>
  );
}