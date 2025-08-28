import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { api } from "../api/api";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10
  });

  // 获取文章列表
  const fetchPosts = async (page = 0) => {
    setLoading(true);
    setError("");
    try {
      // 调用后端接口：GET /api/articles?page=0&size=10&status=PUBLISHED
      const response = await api.get(`/api/articles`, {
        params: {
          page,
          size: 10,
          status: 'PUBLISHED'
        }
      });
      
      console.log('文章列表响应:', response.data);
      
      // Spring Data JPA 分页响应格式
      setPosts(response.data.content || []);
      setPagination({
        currentPage: response.data.number || 0,
        totalPages: response.data.totalPages || 0,
        totalElements: response.data.totalElements || 0,
        size: response.data.size || 10
      });
    } catch (err) {
      console.error('获取文章列表失败:', err);
      setError('获取文章列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时获取第一页数据
  useEffect(() => {
    fetchPosts(0);
  }, []);

  // 上一页
  const handlePrevPage = () => {
    if (pagination.currentPage > 0) {
      fetchPosts(pagination.currentPage - 1);
    }
  };

  // 下一页
  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages - 1) {
      fetchPosts(pagination.currentPage + 1);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="hero">
          <h1>Blog.</h1>
          <p className="muted">A minimal blog inspired by Next.js Blog Starter.</p>
        </section>

        {/* 加载状态 */}
        {loading && (
          <div style={{ textAlign: "center", padding: "2em" }}>
            <p className="muted">加载中...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div style={{ textAlign: "center", padding: "2em" }}>
            <p style={{ color: "red" }}>{error}</p>
            <button onClick={() => fetchPosts(0)} className="btn">
              重新加载
            </button>
          </div>
        )}

        {/* 文章列表 */}
        {!loading && !error && (
          <>
            <section className="list">
              {posts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2em" }}>
                  <p className="muted">暂无文章</p>
                </div>
              ) : (
                posts.map((post) => (
                  <article key={post.id} className="post">
                    <h2 className="post-title">
                      <Link to={`/post/${post.id}`}>{post.title}</Link>
                    </h2>
                    <div className="post-meta">
                      {new Date(post.createdAt || post.publishedAt).toLocaleDateString()} · {post.author || '博主'}
                    </div>
                    <p className="post-excerpt">{post.excerpt || post.content?.substring(0, 150) + '...'}</p>
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
                  （共 {pagination.totalElements} 篇）
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