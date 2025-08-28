import { useState, useEffect } from "react";
import SiteHeader from "../components/SiteHeader";
import { Link } from "react-router-dom";
import { api } from "../api/api";

function groupByYear(list) {
  const map = {};
  list.forEach((p) => {
    const y = new Date(p.createdAt || p.publishedAt || p.date).getFullYear();
    if (!map[y]) map[y] = [];
    map[y].push(p);
  });
  return Object.keys(map)
    .sort((a, b) => Number(b) - Number(a))
    .map((y) => ({ 
      year: y, 
      items: map[y].sort((a, b) => 
        new Date(b.createdAt || b.publishedAt || b.date) - 
        new Date(a.createdAt || a.publishedAt || a.date)
      ) 
    }));
}

export default function Archive() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 获取所有已发布的文章
  useEffect(() => {
    const fetchAllPosts = async () => {
      setLoading(true);
      setError("");
      
      try {
        // 获取所有已发布文章（不分页）
        const response = await api.get('/api/articles', {
          params: {
            status: 'PUBLISHED',
            size: 1000, // 获取足够多的文章用于归档
            sort: 'createdAt,desc'
          }
        });
        
        console.log('归档页面文章响应:', response.data);
        
        // 处理分页响应格式
        const articles = response.data.content || response.data || [];
        setPosts(articles);
      } catch (err) {
        console.error('获取归档文章失败:', err);
        setError('获取文章归档失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  const groups = groupByYear(posts);
  const totalPosts = posts.length;

  // 加载状态
  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="container">
          <section className="hero">
            <h1>归档</h1>
            <p className="muted">按时间整理的所有文章</p>
          </section>
          <div style={{ textAlign: "center", padding: "2em" }}>
            <p className="muted">加载中...</p>
          </div>
        </main>
      </>
    );
  }

  // 错误状态
  if (error) {
    return (
      <>
        <SiteHeader />
        <main className="container">
          <section className="hero">
            <h1>归档</h1>
            <p className="muted">按时间整理的所有文章</p>
          </section>
          <div style={{ textAlign: "center", padding: "2em" }}>
            <p style={{ color: "red" }}>{error}</p>
            <button onClick={() => window.location.reload()} className="btn">
              重新加载
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="hero">
          <h1>归档</h1>
          <p className="muted">按时间整理的所有文章 · 共 {totalPosts} 篇</p>
        </section>

        <div style={{ display: "grid", gap: 24, marginTop: 24 }}>
          {groups.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2em" }}>
              <p className="muted">暂无文章。</p>
              <Link to="/" className="btn">返回首页</Link>
            </div>
          ) : (
            groups.map((g) => (
              <section key={g.year}>
                <h2 style={{ 
                  marginBottom: 16, 
                  fontSize: "1.3em", 
                  color: "#333",
                  borderBottom: "2px solid #0ea5e9",
                  paddingBottom: "0.5em",
                  display: "inline-block"
                }}>
                  {g.year} 
                  <span style={{ 
                    fontSize: "0.8em", 
                    color: "#999", 
                    marginLeft: "0.5em" 
                  }}>
                    ({g.items.length} 篇)
                  </span>
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {g.items.map((p) => (
                    <li 
                      key={p.id} 
                      style={{ 
                        display: "flex", 
                        gap: 16, 
                        padding: "12px 0", 
                        borderBottom: "1px dashed #e5e7eb",
                        alignItems: "center"
                      }}
                    >
                      <span 
                        className="muted" 
                        style={{ 
                          width: 120, 
                          fontSize: "0.9em",
                          flexShrink: 0
                        }}
                      >
                        {new Date(p.createdAt || p.publishedAt || p.date).toLocaleDateString()}
                      </span>
                      <Link 
                        to={`/post/${p.id}`}
                        style={{
                          color: "#333",
                          textDecoration: "none",
                          flex: 1,
                          transition: "color 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#0ea5e9"}
                        onMouseLeave={(e) => e.target.style.color = "#333"}
                      >
                        {p.title}
                      </Link>
                      
                      {/* 显示文章状态（如果有草稿等） */}
                      {p.status && p.status !== 'PUBLISHED' && (
                        <span style={{
                          fontSize: "0.8em",
                          color: "#f59e0b",
                          backgroundColor: "#fef3c7",
                          padding: "2px 6px",
                          borderRadius: "3px"
                        }}>
                          {p.status === 'DRAFT' ? '草稿' : p.status}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>

        {/* 统计信息 */}
        {totalPosts > 0 && (
          <div style={{ 
            textAlign: "center", 
            padding: "2em 0", 
            color: "#666",
            fontSize: "0.9em",
            borderTop: "1px solid #eee",
            marginTop: "2em"
          }}>
            <p>共收录 {totalPosts} 篇文章，跨越 {groups.length} 个年份</p>
            <p>
              最早发布：
              {groups.length > 0 && groups[groups.length - 1].items.length > 0 && 
                new Date(
                  groups[groups.length - 1].items[groups[groups.length - 1].items.length - 1].createdAt ||
                  groups[groups.length - 1].items[groups[groups.length - 1].items.length - 1].publishedAt ||
                  groups[groups.length - 1].items[groups[groups.length - 1].items.length - 1].date
                ).toLocaleDateString()
              }
            </p>
          </div>
        )}

        <footer className="footer">
          © {new Date().getFullYear()} MyBlog
        </footer>
      </main>
    </>
  );
}