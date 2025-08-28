import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react'
import * as jwtDecodeLib from 'jwt-decode'
import { api, setAuthToken, clearAuthToken, setGlobalLogoutCallback, isTokenValid } from '../api/api.js'

const jwtDecode = jwtDecodeLib.jwtDecode || jwtDecodeLib.default

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // 🔥 使用 ref 避免循环依赖
  const isLoggingOut = useRef(false)

  const logout = useCallback(() => {
    if (isLoggingOut.current) return; // 🔥 防止重复调用
    
    isLoggingOut.current = true;
    console.log('AuthContext - 执行登出');
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    clearAuthToken();
    
    isLoggingOut.current = false;
  }, []);

  useEffect(() => {
    setGlobalLogoutCallback(logout);
  }, [logout]);

  useEffect(() => {
    const initAuth = () => {
      console.log('AuthContext - 初始化认证状态');
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser && isTokenValid(savedToken)) {
        try {
          const userData = JSON.parse(savedUser);
          console.log('AuthContext - 恢复用户状态:', userData);
          setToken(savedToken);
          setUser(userData);
          setAuthToken(savedToken);
        } catch (error) {
          console.error('AuthContext - 解析用户数据失败:', error);
          logout();
        }
      } else {
        console.log('AuthContext - 无有效的认证信息，清除状态');
        logout();
      }
      
      setLoading(false);
    };

    initAuth();
  }, [logout]);

  // 🔥 简化 token 验证逻辑，移除快速检查
  useEffect(() => {
    if (token && isTokenValid(token)) {
      setAuthToken(token);
    } else if (token) {
      console.log('AuthContext - Token 无效，执行登出');
      logout();
    }
  }, [token, logout]);

  // 🔥 完全移除可能导致循环的快速检查
  // 如果需要 token 检查，可以在特定操作时手动触发

  const login = useCallback(async (username, password) => {
    try {
      console.log('AuthContext - 开始登录:', username);
      
      const response = await api.post('/api/user/login', { username, password });
      const responseData = response.data;
      
      console.log('AuthContext - 后端完整响应:', responseData);
      
      if (!responseData.success) {
        throw new Error(responseData.message || '登录失败');
      }
      
      if (!responseData.token) {
        throw new Error('登录响应中缺少 token');
      }
      
      const userInfo = {
        username: responseData.username,
        email: responseData.email,
        status: responseData.status,
        nickname: responseData.nickname,
        avatarUrl: responseData.avatarUrl
      };
      
      console.log('AuthContext - 提取的用户信息:', userInfo);
      
      if (!userInfo.username) {
        throw new Error('登录响应中缺少用户名');
      }
      
      if (userInfo.status === null || userInfo.status === undefined) {
        console.warn('AuthContext - status字段缺失，设置为默认值1');
        userInfo.status = 1;
      }
      
      setToken(responseData.token);
      setUser(userInfo);
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      setAuthToken(responseData.token);
      
      console.log('AuthContext - 登录完成');
      return userInfo;
      
    } catch (error) {
      console.error('AuthContext - 登录失败:', error);
      logout();
      throw error;
    }
  }, [logout]);

  const loginWithToken = useCallback((newToken) => {
    if (isTokenValid(newToken)) {
      console.log('AuthContext - 使用有效 Token 登录');
      
      try {
        const decoded = jwtDecode(newToken);
        const username = decoded.sub || decoded.username || null;
        
        if (username) {
          const userInfo = { username };
          setToken(newToken);
          setUser(userInfo);
          localStorage.setItem('token', newToken);
          localStorage.setItem('user', JSON.stringify(userInfo));
          setAuthToken(newToken);
        } else {
          throw new Error('Token 中缺少用户名信息');
        }
      } catch (error) {
        console.error('AuthContext - Token 解码失败:', error);
        throw new Error('Token 无效或已过期');
      }
    } else {
      console.error('AuthContext - 尝试使用无效 Token 登录');
      throw new Error('Token 无效或已过期');
    }
  }, []);

  const register = useCallback(async (payload) => {
    const response = await api.post('/api/user/register', payload);
    if (response.data && !response.data.success) {
      throw new Error(response.data.message || '注册失败');
    }
    return response.data;
  }, []);

  const value = useMemo(() => ({
    user, 
    token, 
    loading,
    isAuthenticated: !!user?.username,
    login, 
    loginWithToken,
    register, 
    logout
  }), [user, token, loading, login, loginWithToken, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}