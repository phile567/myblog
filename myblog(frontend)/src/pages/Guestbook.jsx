import React, { useState, useEffect } from "react";
import SiteHeader from "../components/SiteHeader";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../hooks/usePermissions"; // 🔥 添加权限hook
import { App } from "antd";

export default function Guestbook() {
  const { user } = useAuth();
  const { message } = App.useApp();
  const permissions = usePermissions(); // 🔥 使用权限系统

  // 🔥 根据登录状态动态初始化表单
  const [formData, setFormData] = useState({
    name: user?.username || "", 
    email: "",
    message: ""
  });

  // 留言列表状态
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 分页状态
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10
  });

  // 回复相关状态
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // 🔥 添加调试信息
  useEffect(() => {
    console.log('Guestbook - 用户权限检查:', {
      user: user,
      isAuthor: permissions.isAuthor,
      isLoggedIn: permissions.isLoggedIn
    });
  }, [user, permissions]);

  // 监听用户登录状态变化，自动更新姓名
  useEffect(() => {
    if (user?.username) {
      setFormData(prev => ({
        ...prev,
        name: user.username
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        name: ""
      }));
    }
  }, [user]);

  // 获取留言列表（真实 API）
  const fetchEntries = async (page = 0) => {
    setLoading(true);
    setError("");
    
    try {
      console.log('获取留言列表 - 页码:', page);
      
      const response = await api.get('/api/guestbook', {
        params: { 
          page, 
          size: 10 
        }
      });
      
      console.log('留言列表响应:', response.data);
      
      setEntries(response.data.content || []);
      setPagination({
        currentPage: response.data.number || 0,
        totalPages: response.data.totalPages || 0,
        totalElements: response.data.totalElements || 0,
        size: response.data.size || 10
      });
      
    } catch (err) {
      console.error('获取留言失败:', err);
      setError('获取留言失败，请稍后重试');
      message.error('获取留言失败');
    } finally {
      setLoading(false);
    }
  };

  // 分页控制
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchEntries(newPage);
    }
  };

  // 表单提交（真实 API）
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 对于登录用户，强制使用真实用户名
    const submitData = {
      ...formData,
      name: user?.username || formData.name // 优先使用登录用户名
    };
    
    if (!submitData.name.trim() || !submitData.message.trim()) {
      message.error('姓名和留言内容不能为空');
      return;
    }

    try {
      console.log('提交留言:', submitData);
      
      const response = await api.post('/api/guestbook', submitData);
      
      console.log('留言提交成功:', response.data);
      
      // 重新获取第一页数据
      await fetchEntries(0);
      
      // 清空表单（保持用户名）
      setFormData(prev => ({ 
        name: user?.username || "", 
        email: "", 
        message: "" 
      }));
      
      message.success('留言提交成功！');
      
    } catch (err) {
      console.error('提交留言失败:', err);
      const errorMsg = err.response?.data?.message || '提交失败，请稍后重试';
      message.error(errorMsg);
    }
  };

  // 🔥 删除留言 - 只有作者可以删除
  const handleDelete = async (entryId) => {
    if (!permissions.isAuthor) {
      message.error('只有作者可以删除留言');
      return;
    }

    if (!window.confirm('确定要删除这条留言吗？')) {
      return;
    }

    try {
      console.log('删除留言 ID:', entryId);
      
      await api.delete(`/api/guestbook/${entryId}`);
      
      console.log('留言删除成功');
      
      // 重新获取当前页数据
      await fetchEntries(pagination.currentPage);
      
      message.success('留言删除成功');
      
    } catch (err) {
      console.error('删除留言失败:', err);
      const errorMsg = err.response?.data?.message || '删除失败';
      message.error(errorMsg);
    }
  };

  // 开始回复
  const handleStartReply = (entry) => {
    if (!permissions.isAuthor) {
      message.error('只有作者可以回复留言');
      return;
    }
    setReplyingTo(entry.id);
    setReplyText('');
  };

  // 取消回复
  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  // 🔥 提交回复 - 只有作者可以回复
  const handleSubmitReply = async () => {
    if (!permissions.isAuthor) {
      message.error('只有作者可以回复留言');
      return;
    }

    if (!replyText.trim()) {
      message.error('回复内容不能为空');
      return;
    }

    setReplyLoading(true);
    
    try {
      console.log('回复留言 ID:', replyingTo, '内容:', replyText);
      
      await api.put(`/api/guestbook/${replyingTo}/reply`, { 
        reply: replyText 
      });
      
      console.log('回复成功');
      
      // 重新获取当前页数据
      await fetchEntries(pagination.currentPage);
      
      setReplyingTo(null);
      setReplyText('');
      message.success('回复成功');
      
    } catch (err) {
      console.error('回复失败:', err);
      const errorMsg = err.response?.data?.message || '回复失败';
      message.error(errorMsg);
    } finally {
      setReplyLoading(false);
    }
  };

  const onChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // 页面加载时获取留言
  useEffect(() => {
    fetchEntries(0);
  }, []);

  return (
    <>
      <SiteHeader />
      <div className="container">
        <h1 className="title">留言板</h1>
        
        {/* 登录用户欢迎信息 */}
        {user?.username && (
          <div style={{ 
            background: '#f0f9ff', 
            padding: '16px', 
            borderRadius: '12px',
            marginBottom: '24px',
            border: '1px solid #e0f2fe'
          }}>
            <span style={{ color: '#0284c7', fontSize: '15px' }}>
              👋 欢迎回来，<strong>{user.username}</strong>！
              {/* 🔥 显示作者身份 */}
              {permissions.isAuthor && (
                <span style={{ 
                  marginLeft: '8px',
                  fontSize: '12px',
                  backgroundColor: '#fef3c7',
                  color: '#d97706',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 'normal'
                }}>
                  博主
                </span>
              )}
            </span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="guestbook-form">
          {/* 根据登录状态显示不同的姓名字段 */}
          {user?.username ? (
            // 登录用户：显示只读的用户名
            <div className="field">
              <label htmlFor="name">用户名</label>
              <input
                id="name"
                name="name"
                className="input"
                value={user.username}
                readOnly
                style={{
                  backgroundColor: '#f8f9fa',
                  cursor: 'not-allowed',
                  color: '#6c757d'
                }}
              />
              <div className="hint">已登录用户自动使用账号用户名</div>
            </div>
          ) : (
            // 未登录用户：可编辑的姓名字段
            <div className="field">
              <label htmlFor="name">姓名 *</label>
              <input
                id="name"
                name="name"
                className="input"
                placeholder="请输入您的姓名"
                value={formData.name}
                onChange={onChange}
                required
              />
              <div className="hint">
                <a href="/login" style={{ color: 'var(--link-color)' }}>
                  登录后可自动填入用户名
                </a>
              </div>
            </div>
          )}

          <div className="field">
            <label htmlFor="email">邮箱（可选）</label>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              placeholder="请输入您的邮箱"
              value={formData.email}
              onChange={onChange}
            />
          </div>

          <div className="field">
            <label htmlFor="message">留言内容 *</label>
            <textarea
              id="message"
              name="message"
              className="textarea"
              placeholder="请输入您的留言"
              rows="4"
              value={formData.message}
              onChange={onChange}
              required
            />
          </div>

          <button type="submit" className="button primary">
            提交留言
          </button>
        </form>

        <hr style={{ margin: "2em 0" }} />

        {/* 留言列表头部信息 */}
        <div className="guestbook-header">
          <h2>留言列表</h2>
          {!loading && (
            <div style={{ fontSize: "0.9em", color: "#666", marginBottom: "1em" }}>
              共 {pagination.totalElements} 条留言
              {pagination.totalPages > 1 && (
                <span>，第 {pagination.currentPage + 1} / {pagination.totalPages} 页</span>
              )}
            </div>
          )}
        </div>

        {loading && <div className="loading">正在加载留言...</div>}
        
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            {/* 留言列表 */}
            <div className="guestbook-list">
              {entries.length === 0 ? (
                <div className="no-entries">暂无留言，快来抢沙发吧！</div>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="guestbook-entry">
                    {/* 留言头部 */}
                    <div className="entry-header">
                      <div className="user-info">
                        <strong className="user-name">
                          {entry.name}
                          {/* 🔥 为注册用户添加标识 */}
                          {entry.isRegisteredUser && !permissions.isAuthor && (
                            <span style={{
                              marginLeft: '8px',
                              fontSize: '12px',
                              backgroundColor: '#e0f2fe',
                              color: '#0284c7',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 'normal'
                            }}>
                              注册用户
                            </span>
                          )}
                          {/* 🔥 为博主添加特殊标识 - 使用权限系统判断 */}
                          {entry.name === user?.username && permissions.isAuthor && (
                            <span style={{
                              marginLeft: '8px',
                              fontSize: '12px',
                              backgroundColor: '#fef3c7',
                              color: '#d97706',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 'normal'
                            }}>
                              博主
                            </span>
                          )}
                        </strong>
                        <span className="timestamp">
                          {new Date(entry.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      {/* 🔥 作者管理操作按钮 - 使用权限系统 */}
                      {permissions.isAuthor && (
                        <div className="admin-actions">
                          <button 
                            className="reply-btn"
                            onClick={() => handleStartReply(entry)}
                          >
                            回复
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDelete(entry.id)}
                          >
                            删除
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* 留言内容 */}
                    <div className="entry-content">
                      {entry.message}
                    </div>
                    
                    {/* 博主回复 */}
                    {entry.hasReply && entry.reply && (
                      <div className="author-reply">
                        <div className="reply-header">
                          <strong>博主回复：</strong>
                        </div>
                        <div className="reply-content">
                          {entry.reply}
                        </div>
                      </div>
                    )}

                    {/* 回复表单 */}
                    {replyingTo === entry.id && (
                      <div className="reply-form">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="输入回复内容..."
                          rows="3"
                        />
                        <div className="reply-actions">
                          <button 
                            onClick={handleSubmitReply}
                            disabled={replyLoading}
                          >
                            {replyLoading ? '发送中...' : '发送回复'}
                          </button>
                          <button onClick={handleCancelReply}>
                            取消
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* 分页控件 */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="pagination-btn"
                  disabled={pagination.currentPage === 0}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                >
                  上一页
                </button>
                
                <span className="pagination-info">
                  第 {pagination.currentPage + 1} 页，共 {pagination.totalPages} 页
                </span>
                
                <button 
                  className="pagination-btn"
                  disabled={pagination.currentPage >= pagination.totalPages - 1}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}