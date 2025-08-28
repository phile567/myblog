import React, { useState, useEffect } from 'react';
import { App } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import SiteHeader from "../components/SiteHeader";
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { api } from '../api/api';

export default function MyArticles() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const permissions = usePermissions();

  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10
  });

  // 🔥 权限检查 - 修复逻辑
  useEffect(() => {
    console.log('MyArticles - 权限检查:', {
      user: user,
      canAccessMyArticles: permissions.canAccessMyArticles,
      isAuthor: permissions.isAuthor
    });

    if (!user) {
      console.log('MyArticles - 用户未登录，跳转到登录页');
      navigate('/login');
      return;
    }

    if (!permissions.canAccessMyArticles) {
      console.log('MyArticles - 没有访问权限，跳转到首页');
      navigate('/');
      return;
    }

    // 有权限，获取文章
    fetchMyArticles();
  }, [user, permissions.canAccessMyArticles, navigate]);

  // 获取我的文章列表
  const fetchMyArticles = async (page = 0) => {
    console.log('MyArticles - 开始获取文章列表, page:', page);
    setLoading(true);
    setError("");
    
    try {
      const response = await api.get('/api/articles/me', {
        params: {
          page,
          size: 10,
          sort: 'createdAt,desc'
        }
      });
      
      console.log('MyArticles - 文章列表响应:', response.data);
      
      const articles = response.data.content || [];
      setMyPosts(articles);
      setPagination({
        currentPage: response.data.number || 0,
        totalPages: response.data.totalPages || 0,
        totalElements: response.data.totalElements || 0,
        size: response.data.size || 10
      });

      console.log('MyArticles - 设置文章数据:', {
        articleCount: articles.length,
        pagination: {
          currentPage: response.data.number || 0,
          totalPages: response.data.totalPages || 0,
          totalElements: response.data.totalElements || 0
        }
      });

    } catch (err) {
      console.error('MyArticles - 获取文章失败:', err);
      let errorMessage = '获取文章列表失败';
      
      if (err.response?.status === 403) {
        errorMessage = '没有权限访问文章列表';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("确定要删除这篇文章吗？")) {
      try {
        await api.delete(`/api/articles/${id}`);
        message.success("文章删除成功！");
        fetchMyArticles(pagination.currentPage);
      } catch (err) {
        console.error('删除文章失败:', err);
        const msg = err.response?.data?.message || "删除失败，请重试";
        message.error(msg);
      }
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 0) {
      fetchMyArticles(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages - 1) {
      fetchMyArticles(pagination.currentPage + 1);
    }
  };

  // 🔥 加载状态优先显示
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

  // 🔥 权限检查
  if (!user) {
    return (
      <>
        <SiteHeader />
        <div className="container">
          <div className="access-denied">
            <h2>请先登录</h2>
            <Link to="/login">去登录</Link>
          </div>
        </div>
      </>
    );
  }

  if (!permissions.canAccessMyArticles) {
    return (
      <>
        <SiteHeader />
        <div className="container">
          <div className="access-denied">
            <h2>访问受限</h2>
            <p>只有作者可以访问文章管理页面</p>
            <p>当前用户：{user.username}，状态：{user.status}</p>
            <Link to="/">返回首页</Link>
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
          <h1>我的文章</h1>
          <p className="muted">管理你的所有文章，包括已发布和草稿</p>
        </section>

        <div style={{ marginBottom: "2em", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/create" className="btn">发布新文章</Link>
          
          {!error && (
            <div style={{ color: "#666", fontSize: "0.9em" }}>
              共 {pagination.totalElements} 篇文章
            </div>
          )}
        </div>

        {/* 错误状态 */}
        {error && (
          <div style={{ textAlign: "center", padding: "2em" }}>
            <p style={{ color: "red" }}>{error}</p>
            <button onClick={() => fetchMyArticles(0)} className="btn">
              重新加载
            </button>
          </div>
        )}

        {/* 文章列表 */}
        {!error && (
          <>
            <section className="list">
              {myPosts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2em" }}>
                  <p className="muted">暂无文章。</p>
                  <Link to="/create" className="btn">
                    发布第一篇文章
                  </Link>
                </div>
              ) : (
                myPosts.map((p) => (
                  <article key={p.id} className="post" style={{ position: "relative" }}>
                    <h2 className="post-title">
                      <Link to={`/posts/${p.id}`}>{p.title}</Link>
                      
                      <span style={{
                        marginLeft: "0.5em",
                        fontSize: "0.7em",
                        padding: "2px 6px",
                        borderRadius: "3px",
                        backgroundColor: p.status === 'PUBLISHED' ? '#22c55e' : '#f59e0b',
                        color: 'white'
                      }}>
                        {p.status === 'PUBLISHED' ? '已发布' : '草稿'}
                      </span>
                    </h2>
                    
                    <div className="post-meta">
                      {new Date(p.createdAt || p.updatedAt).toLocaleDateString()} · {user.username}
                      {p.updatedAt !== p.createdAt && (
                        <span style={{ color: "#999", marginLeft: "0.5em" }}>
                          (已更新)
                        </span>
                      )}
                    </div>
                    
                    <p className="post-excerpt">{p.summary || p.excerpt || (p.content?.substring(0, 100) + '...')}</p>
                    
                    <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <Link 
                          to={`/edit/${p.id}`} 
                          style={{ 
                            marginRight: 16, 
                            color: "#0ea5e9", 
                            textDecoration: "none",
                            fontSize: "14px"
                          }}
                        >
                          ✏️ 编辑
                        </Link>
                        <Link 
                          to={`/posts/${p.id}`} 
                          style={{ 
                            marginRight: 16, 
                            color: "#22c55e", 
                            textDecoration: "none",
                            fontSize: "14px"
                          }}
                        >
                          👁️ 查看
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          style={{
                            color: "#ef4444",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "14px"
                          }}
                        >
                          🗑️ 删除
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </section>

            {/* 分页控件 */}
            {pagination.totalPages > 1 && (
              <div style={{ 
                textAlign: "center", 
                margin: "2em 0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1em"
              }}>
                <button 
                  onClick={handlePrevPage}
                  disabled={pagination.currentPage === 0}
                  style={{
                    padding: "0.5em 1em",
                    border: "1px solid #ddd",
                    background: pagination.currentPage === 0 ? "#f5f5f5" : "white",
                    cursor: pagination.currentPage === 0 ? "not-allowed" : "pointer"
                  }}
                >
                  上一页
                </button>
                
                <span className="muted">
                  {pagination.currentPage + 1} / {pagination.totalPages}
                </span>
                
                <button 
                  onClick={handleNextPage}
                  disabled={pagination.currentPage >= pagination.totalPages - 1}
                  style={{
                    padding: "0.5em 1em",
                    border: "1px solid #ddd",
                    background: pagination.currentPage >= pagination.totalPages - 1 ? "#f5f5f5" : "white",
                    cursor: pagination.currentPage >= pagination.totalPages - 1 ? "not-allowed" : "pointer"
                  }}
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}

        <footer className="footer">
          © {new Date().getFullYear()} MyBlog · Minimal theme
        </footer>
      </main>
    </>
  );
}