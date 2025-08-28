import SiteHeader from "../components/SiteHeader";

export default function About() {
  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="hero">
          <h1>关于</h1>
          <p className="muted">个人博客 · 极简风</p>
        </section>

        <section style={{ maxWidth: "600px", lineHeight: 1.8 }}>
          <h2 style={{ fontSize: "1.3em", marginBottom: "1em", color: "#333" }}>关于这个博客</h2>
          <p style={{ marginBottom: "1.5em", color: "#555" }}>
            这是一个简洁的个人博客，专注于分享技术学习、踩坑经验和个人思考。
            秉承「少即是多」的设计理念，用最简单的方式呈现内容，让阅读回归本质。
          </p>

          <h2 style={{ fontSize: "1.3em", marginBottom: "1em", color: "#333" }}>关于博主</h2>
          <p style={{ marginBottom: "1em", color: "#555" }}>
            👋 你好，我是这里的博主！
          </p>
          <ul style={{ marginBottom: "1.5em", color: "#555", paddingLeft: "1.5em" }}>
            <li style={{ marginBottom: "0.5em" }}>💻 热爱编程，喜欢探索新技术</li>
            <li style={{ marginBottom: "0.5em" }}>📚 终身学习者，相信知识的力量</li>
            <li style={{ marginBottom: "0.5em" }}>✍️ 喜欢记录和分享，把复杂的事情讲简单</li>
            <li style={{ marginBottom: "0.5em" }}>🤔 偶尔会有一些不成熟的想法，也会分享出来</li>
          </ul>

          <h2 style={{ fontSize: "1.3em", marginBottom: "1em", color: "#333" }}>技术栈</h2>
          <div style={{ marginBottom: "1.5em" }}>
            <div style={{ marginBottom: "0.8em" }}>
              <strong style={{ color: "#333" }}>前端：</strong>
              <span style={{ color: "#555", marginLeft: "0.5em" }}>
                React、JavaScript、HTML/CSS、Vite
              </span>
            </div>
            <div style={{ marginBottom: "0.8em" }}>
              <strong style={{ color: "#333" }}>后端：</strong>
              <span style={{ color: "#555", marginLeft: "0.5em" }}>
                Spring Boot、Java、MySQL
              </span>
            </div>
            <div style={{ marginBottom: "0.8em" }}>
              <strong style={{ color: "#333" }}>工具：</strong>
              <span style={{ color: "#555", marginLeft: "0.5em" }}>
                VS Code、Git、Maven
              </span>
            </div>
          </div>

          <h2 style={{ fontSize: "1.3em", marginBottom: "1em", color: "#333" }}>联系方式</h2>
          <p style={{ marginBottom: "1.5em", color: "#555" }}>
            如果你有任何问题、建议或者想要交流，欢迎在 
            <a href="/guestbook" style={{ color: "#0ea5e9", textDecoration: "none", margin: "0 0.3em" }}>
              留言板
            </a> 
            留言，我会认真回复每一条留言！
          </p>

          <div style={{ 
            padding: "1.5em", 
            backgroundColor: "#f8f9fa", 
            borderRadius: "8px",
            border: "1px solid #e9ecef",
            marginBottom: "2em"
          }}>
            <p style={{ margin: 0, color: "#666", fontSize: "0.95em", textAlign: "center" }}>
              💡 "最好的学习方式就是教会别人" 
              <br />
              <span style={{ fontSize: "0.9em", fontStyle: "italic" }}>
                希望这个小站能对你有所帮助
              </span>
            </p>
          </div>

          <div style={{ textAlign: "center", color: "#999", fontSize: "0.9em" }}>
            <p>感谢你的访问 🙏</p>
            <p>最后更新：{new Date().getFullYear()}年{new Date().getMonth() + 1}月</p>
          </div>
        </section>

        <footer className="footer">
          © {new Date().getFullYear()} MyBlog
        </footer>
      </main>
    </>
  );
}