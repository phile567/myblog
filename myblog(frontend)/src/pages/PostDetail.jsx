import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SiteHeader from "../components/SiteHeader";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";
import { App } from "antd";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { message } = App.useApp();
  const BLOG_OWNER = "test";

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  // 获取文章详情
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError("");
      setNotFound(false);
      
      try {
        console.log('获取文章详情, ID:', id);
        const response = await api.get(`/api/articles/${id}`);
        console.log('文章详情响应:', response.data);
        
        setPost(response.data);
      } catch (err) {
        console.error('获取文章详情失败:', err);
        
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("获取文章失败，请重试");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("确定要删除这篇文章吗？")) {
      try {
        await api.delete(`/api/articles/${post.id}`);
        message.success("文章删除成功！");
        navigate("/me");
      } catch (err) {
        console.error('删除文章失败:', err);
        const msg = err.response?.data?.message || "删除失败，请重试";
        message.error(msg);
      }
    }
  };

  // 加载状态
  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="container">
          <div style={{ textAlign: "center", padding: "2em" }}>
            <p className="muted">加载中...</p>
          </div>
        </main>
      </>
    );
  }

  // 文章不存在
  if (notFound) {
    return (
      <>
        <SiteHeader />
        <main className="container">
          <div style={{ textAlign: "center", padding: "2em" }}>
            <h1>文章不存在</h1>
            <p className="muted">找不到您要查看的文章。</p>
            <div style={{ marginTop: "1em" }}>
              <Link to="/" className="btn">返回首页</Link>
              <Link to="/me" className="btn ghost" style={{ marginLeft: "1em" }}>
                我的文章
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // 网络错误
  if (error) {
    return (
      <>
        <SiteHeader />
        <main className="container">
          <div style={{ textAlign: "center", padding: "2em" }}>
            <h1>加载失败</h1>
            <p style={{ color: "red" }}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn"
            >
              重新加载
            </button>
          </div>
        </main>
      </>
    );
  }

  // 正常显示文章
  return (
    <>
      <SiteHeader />
      <main className="container article">
        <div style={{ marginBottom: "2em" }}>
          <h1 style={{ marginBottom: "0.5em" }}>{post.title}</h1>
          <div className="meta" style={{ 
            color: "#666", 
            fontSize: "0.9em",
            borderBottom: "1px solid #eee",
            paddingBottom: "1em"
          }}>
            <span>
              {new Date(post.createdAt || post.publishedAt).toLocaleDateString()}
            </span>
            <span style={{ margin: "0 0.5em" }}>·</span>
            <span>{post.author || "博主"}</span>
            {post.status && (
              <>
                <span style={{ margin: "0 0.5em" }}>·</span>
                <span style={{ 
                  color: post.status === 'PUBLISHED' ? '#22c55e' : '#f59e0b',
                  fontSize: "0.8em"
                }}>
                  {post.status === 'PUBLISHED' ? '已发布' : '草稿'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 文章摘要 */}
        {post.excerpt && (
          <div style={{ 
            backgroundColor: "#f8f9fa", 
            padding: "1em", 
            borderRadius: "4px",
            marginBottom: "2em",
            fontStyle: "italic",
            color: "#666"
          }}>
            {post.excerpt}
          </div>
        )}

        {/* Markdown 渲染的文章内容 */}
        <div className="content markdown-body" style={{ 
          lineHeight: 1.8, 
          fontSize: "1.1em",
          marginBottom: "2em"
        }}>
          <ReactMarkdown
            components={{
              // 代码块语法高亮
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code 
                    className={className} 
                    style={{
                      backgroundColor: '#f1f3f4',
                      padding: '2px 4px',
                      borderRadius: '3px',
                      fontSize: '0.9em'
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              // 标题样式
              h1: ({children}) => <h1 style={{marginTop: '2em', marginBottom: '1em'}}>{children}</h1>,
              h2: ({children}) => <h2 style={{marginTop: '1.5em', marginBottom: '0.8em'}}>{children}</h2>,
              h3: ({children}) => <h3 style={{marginTop: '1.2em', marginBottom: '0.6em'}}>{children}</h3>,
              // 段落样式
              p: ({children}) => <p style={{marginBottom: '1em'}}>{children}</p>,
              // 引用样式
              blockquote: ({children}) => (
                <blockquote style={{
                  borderLeft: '4px solid #ddd',
                  paddingLeft: '1em',
                  margin: '1em 0',
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  {children}
                </blockquote>
              ),
              // 链接样式
              a: ({children, href}) => (
                <a href={href} style={{color: '#0ea5e9', textDecoration: 'none'}} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              // 表格样式
              table: ({children}) => (
                <table style={{
                  borderCollapse: 'collapse',
                  width: '100%',
                  margin: '1em 0'
                }}>
                  {children}
                </table>
              ),
              th: ({children}) => (
                <th style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  backgroundColor: '#f5f5f5',
                  textAlign: 'left'
                }}>
                  {children}
                </th>
              ),
              td: ({children}) => (
                <td style={{
                  border: '1px solid #ddd',
                  padding: '8px'
                }}>
                  {children}
                </td>
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* 博主专属操作 */}
        {user?.username === BLOG_OWNER && (
          <div style={{ 
            marginTop: "2em", 
            paddingTop: "1em", 
            borderTop: "2px solid #eee",
            backgroundColor: "#fafafa",
            padding: "1em",
            borderRadius: "4px"
          }}>
            <div style={{ fontSize: "0.9em", color: "#666", marginBottom: "0.5em" }}>
              管理操作：
            </div>
            <Link 
              to={`/edit/${post.id}`} 
              style={{ 
                marginRight: "1em", 
                color: "#0ea5e9", 
                textDecoration: "none",
                fontSize: "14px"
              }}
            >
              ✏️ 编辑文章
            </Link>
            <button
              onClick={handleDelete}
              style={{
                color: "#ef4444",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              🗑️ 删除文章
            </button>
          </div>
        )}

        {/* 导航按钮 */}
        <div style={{ 
          marginTop: "2em", 
          paddingTop: "1em",
          borderTop: "1px solid #eee",
          display: "flex",
          gap: "1em"
        }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: "1px solid #ddd",
              color: "#0ea5e9",
              cursor: "pointer",
              padding: "0.5em 1em",
              borderRadius: "4px"
            }}
          >
            ← 返回首页
          </button>
          {user?.username === BLOG_OWNER && (
            <button
              onClick={() => navigate("/me")}
              style={{
                background: "transparent",
                border: "1px solid #ddd",
                color: "#0ea5e9",
                cursor: "pointer",
                padding: "0.5em 1em",
                borderRadius: "4px"
              }}
            >
              📝 我的文章
            </button>
          )}
        </div>

        <footer className="footer">
          © {new Date().getFullYear()} MyBlog
        </footer>
      </main>
    </>
  );
}