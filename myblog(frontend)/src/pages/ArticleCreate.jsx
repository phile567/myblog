import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions'; // 🔥 导入权限Hook
import { api } from '../api/api';
import MDEditor from '@uiw/react-md-editor';
import SiteHeader from "../components/SiteHeader";
import { App } from "antd";

export default function ArticleCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const permissions = usePermissions(); // 🔥 使用权限Hook
  const { message } = App.useApp();

  const [values, setValues] = useState({
    title: "",
    content: "",
    excerpt: "",
    status: "PUBLISHED" // 默认发布状态
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 权限检查
  useEffect(() => {
    if (!permissions.canAccessCreatePage) {
      navigate('/');
      return;
    }
  }, [permissions.canAccessCreatePage, navigate]);

  const onChange = (e) => {
    setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  };

  // Markdown 编辑器内容变化处理
  const onContentChange = (val) => {
    setValues(v => ({ ...v, content: val || "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { title, content, excerpt, status } = values;
    if (!title.trim()) {
      setError("请输入文章标题");
      return;
    }
    if (!content.trim()) {
      setError("请输入文章内容");
      return;
    }

    setLoading(true);
    try {
      // 调用后端创建文章接口 POST /api/articles
      const requestData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || content.trim().substring(0, 100) + "...",
        status: status
      };

      console.log('发送创建文章请求:', requestData);
      
      const response = await api.post("/api/articles", requestData);
      
      console.log('创建文章响应:', response.data);
      
      message.success("文章发布成功！");
      
      // 发布成功后跳转到文章详情页或我的文章页
      if (response.data && response.data.id) {
        navigate(`/post/${response.data.id}`); // 跳转到新创建的文章详情页
      } else {
        navigate("/me"); // 或者跳转到我的文章页
      }
    } catch (err) {
      console.error('创建文章失败:', err);
      
      // 处理不同类型的错误
      let errorMessage = "发布失败，请重试";
      
      if (err.response?.status === 401) {
        errorMessage = "登录状态已过期，请重新登录";
      } else if (err.response?.status === 403) {
        errorMessage = "没有权限执行此操作";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        // 处理验证错误
        const validationErrors = err.response.data.errors;
        errorMessage = Object.values(validationErrors).join('; ');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 保存为草稿
  const saveDraft = async () => {
    const { title, content, excerpt } = values;
    if (!title.trim() || !content.trim()) {
      setError("标题和内容不能为空");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || content.trim().substring(0, 100) + "...",
        status: "DRAFT"
      };

      const response = await api.post("/api/articles", requestData);
      message.success("草稿保存成功！");
      navigate("/me");
    } catch (err) {
      console.error('保存草稿失败:', err);
      const errorMessage = err.response?.data?.message || "保存失败，请重试";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 如果没有权限，显示提示
  if (!permissions.canAccessCreatePage) {
    return (
      <div className="container">
        <div className="access-denied">
          <h2>访问受限</h2>
          <p>只有作者可以创建文章</p>
          <Link to="/">返回首页</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="hero">
          <h1>发布新文章</h1>
          <p className="muted">创作你的精彩内容 - 支持 Markdown 语法</p>
        </section>

        <form className="form" onSubmit={onSubmit} style={{ maxWidth: "900px" }}>
          <div className="field">
            <label htmlFor="title">文章标题 *</label>
            <input
              id="title"
              name="title"
              className="input"
              placeholder="请输入文章标题"
              value={values.title}
              onChange={onChange}
              maxLength={200}
            />
          </div>

          <div className="field">
            <label htmlFor="excerpt">摘要（可选）</label>
            <textarea
              id="excerpt"
              name="excerpt"
              className="input"
              placeholder="请输入文章摘要，留空则自动生成"
              rows="3"
              value={values.excerpt}
              onChange={onChange}
              maxLength={500}
            />
            <div className="hint">摘要将显示在文章列表中，最多500字</div>
          </div>

          <div className="field">
            <label htmlFor="content">文章内容 * (Markdown 编辑器)</label>
            <div data-color-mode="light" style={{ marginTop: "0.5em" }}>
              <MDEditor
                value={values.content}
                onChange={onContentChange}
                height={500}
                preview="edit"
                visibleDragBar={false}
                textareaProps={{
                  placeholder: '在这里编写你的文章内容，支持 Markdown 语法...'
                }}
              />
            </div>
            <div className="hint">
              支持 Markdown 语法：**粗体**、*斜体*、`代码`、[链接](url)、## 标题等
            </div>
          </div>

          <div className="field">
            <label htmlFor="status">发布状态</label>
            <select
              id="status"
              name="status"
              className="input"
              value={values.status}
              onChange={onChange}
            >
              <option value="PUBLISHED">立即发布</option>
              <option value="DRAFT">保存为草稿</option>
            </select>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "发布中..." : values.status === "PUBLISHED" ? "发布文章" : "保存草稿"}
            </button>
            
            {values.status === "PUBLISHED" && (
              <button 
                type="button" 
                className="btn ghost" 
                onClick={saveDraft}
                disabled={loading}
                style={{ marginLeft: "1em" }}
              >
                {loading ? "保存中..." : "保存草稿"}
              </button>
            )}
            
            <button 
              type="button" 
              className="btn ghost" 
              onClick={() => navigate("/me")}
              disabled={loading}
              style={{ marginLeft: "1em" }}
            >
              取消
            </button>
          </div>
        </form>

        <footer className="footer">
          © {new Date().getFullYear()} MyBlog
        </footer>
      </main>
    </>
  );
}