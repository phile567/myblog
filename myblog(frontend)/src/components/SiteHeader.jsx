import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../hooks/usePermissions"; // 🔥 导入权限Hook
import GoogleTranslate from './GoogleTranslate';

export default function SiteHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const permissions = usePermissions(); // 🔥 使用权限Hook

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand">我的博客</Link>
        <nav className="nav">
          <Link to="/" style={{ fontWeight: pathname === "/" ? 600 : 400 }}>
            首页
          </Link>
          
          {/* 🔥 只有作者才能看到这些菜单 */}
          {permissions.isAuthor && (
            <>
              <Link to="/me" style={{ fontWeight: pathname === "/me" ? 600 : 400 }}>
                我的文章
              </Link>
              <Link to="/create" style={{ fontWeight: pathname === "/create" ? 600 : 400 }}>
                写文章
              </Link>
            </>
          )}
          
          <Link to="/archive" style={{ fontWeight: pathname === "/archive" ? 600 : 400 }}>
            归档
          </Link>
          <Link to="/about" style={{ fontWeight: pathname === "/about" ? 600 : 400 }}>
            关于
          </Link>
          <Link to="/guestbook" style={{ fontWeight: pathname === "/guestbook" ? 600 : 400 }}>
            留言板
          </Link>
          
          {user?.username ? (
            <button onClick={handleLogout} className="logout-btn">
              退出
            </button>
          ) : (
            <Link to="/login">登录</Link>
          )}
          
         <GoogleTranslate /> 
        </nav>
      </div>
    </header>
  );
}