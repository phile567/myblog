import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Archive from "./pages/Archive";
import About from "./pages/About";
import MyArticles from "./pages/MyArticles";
import ArticleCreate from "./pages/ArticleCreate";
import ArticleEdit from "./pages/ArticleEdit";
import Guestbook from "./pages/Guestbook"; // 新增

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/about" element={<About />} />
      <Route path="/me" element={<MyArticles />} />
      <Route path="/create" element={<ArticleCreate />} />
      <Route path="/edit/:id" element={<ArticleEdit />} />
      <Route path="/guestbook" element={<Guestbook />} /> {/* 新增 */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}