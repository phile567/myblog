import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { api } from '../api/api';
import MDEditor from '@uiw/react-md-editor';
import SiteHeader from "../components/SiteHeader";
import { App } from "antd";

export default function ArticleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const permissions = usePermissions();
  const { message } = App.useApp();
  
  const [article, setArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    status: 'DRAFT'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log('ArticleEdit - 开始加载文章, ID:', id);
    console.log('ArticleEdit - 当前用户:', user);
    console.log('ArticleEdit - 权限信息:', permissions);
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      console.log('ArticleEdit - 请求文章详情, ID:', id);
      
      // 🔥 修复API路径：添加 /api 前缀
      const response = await api.get(`/api/articles/${id}`);
      const articleData = response.data;
      
      console.log('ArticleEdit - 获取到文章数据:', articleData);
      
      // 🔥 权限检查：只有文章作者才能编辑
      if (!permissions.canEditArticle(articleData.author)) {
        console.log('ArticleEdit - 权限检查失败:', {
          articleAuthor: articleData.author,
          currentUser: user?.username,
          canEdit: permissions.canEditArticle(articleData.author)
        });
        message.error('你没有权限编辑这篇文章');
        navigate('/');
        return;
      }
      
      console.log('ArticleEdit - 权限检查通过');
      
      setArticle(articleData);
      setFormData({
        title: articleData.title || '',
        content: articleData.content || '',
        summary: articleData.summary || '',
        status: articleData.status || 'DRAFT'
      });
      
      console.log('ArticleEdit - 表单数据已设置:', {
        title: articleData.title,
        status: articleData.status
      });
      
    } catch (error) {
      console.error('ArticleEdit - 获取文章失败:', error);
      
      let errorMessage = '获取文章失败';
      if (error.response?.status === 404) {
        errorMessage = '文章不存在';
      } else if (error.response?.status === 403) {
        errorMessage = '没有权限访问此文章';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      message.error(errorMessage);
      navigate('/me');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      message.error('标题和内容不能为空');
      return;
    }

    setSaving(true);
    try {
      console.log('ArticleEdit - 提交更新:', formData);
      
      // 🔥 修复API路径：添加 /api 前缀
      await api.put(`/api/articles/${id}`, formData);
      
      console.log('ArticleEdit - 更新成功');
      message.success("文章更新成功！");
      navigate('/me');
    } catch (error) {
      console.error('ArticleEdit - 更新失败:', error);
      
      let errorMessage = '更新文章失败';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      message.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔥 权限预检查
  useEffect(() => {
    if (!user) {
      console.log('ArticleEdit - 用户未登录，跳转到登录页');
      navigate('/login');
      return;
    }

    if (!permissions.isAuthor) {
      console.log('ArticleEdit - 非作者用户，跳转到首页');
      message.error('只有作者可以编辑文章');
      navigate('/');
      return;
    }
  }, [user, permissions.isAuthor, navigate, message]);

  if (loading) {
    return (
      <>
        <SiteHeader />
        <div className="container">
          <div style={{ textAlign: "center", padding: "2em" }}>
            <p className="muted">加载中...</p>
          </div>
        </div>
      </>
    );
  }

  // 🔥 如果没有权限或文章不存在
  if (!article) {
    return (
      <>
        <SiteHeader />
        <div className="container">
          <div className="access-denied">
            <h2>文章不存在</h2>
            <p>请检查文章ID是否正确</p>
            <Link to="/me">返回我的文章</Link>
          </div>
        </div>
      </>
    );
  }

  if (!permissions.canEditArticle(article.author)) {
    return (
      <>
        <SiteHeader />
        <div className="container">
          <div className="access-denied">
            <h2>访问受限</h2>
            <p>你没有权限编辑这篇文章</p>
            <p>文章作者：{article.author}，当前用户：{user?.username}</p>
            <Link to="/me">返回我的文章</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="hero">
          <h1>编辑文章</h1>
          <p className="muted">修改你的精彩内容 - 支持 Markdown 语法</p>
        </section>

        <form onSubmit={handleSubmit} className="article-form" style={{ maxWidth: "900px" }}>
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="文章标题"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="summary"
              placeholder="文章摘要（可选）"
              value={formData.summary}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">文章内容 * (Markdown 编辑器)</label>
            <div data-color-mode="light" style={{ marginTop: "0.5em" }}>
              <MDEditor
                value={formData.content}
                onChange={val => setFormData(prev => ({ ...prev, content: val || "" }))}
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

          <div className="form-group">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
            >
              <option value="DRAFT">草稿</option>
              <option value="PUBLISHED">发布</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? '保存中...' : '保存修改'}
            </button>
            <Link to="/me" className="btn btn-secondary" style={{ marginLeft: "1em" }}>
              返回文章列表
            </Link>
          </div>
        </form>

        <footer className="footer">
          © {new Date().getFullYear()} MyBlog
        </footer>
      </main>
    </>
  );
}