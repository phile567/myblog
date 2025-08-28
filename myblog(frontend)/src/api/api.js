import axios from 'axios';

let globalLogoutCallback = null;

export const api = axios.create({
  baseURL: 'http://localhost:8080', // 🔥 确保基础路径正确
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token 有效性检查
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // 转换为毫秒
    return Date.now() < exp;
  } catch (error) {
    console.error('Token 解析失败:', error);
    return false;
  }
};

// 设置认证 token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// 清除认证 token
export const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

// 设置全局登出回调
export const setGlobalLogoutCallback = (callback) => {
  globalLogoutCallback = callback;
};

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API请求:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log('API响应:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API响应错误:', error);
    
    if (error.response?.status === 401) {
      console.log('收到 401 响应，执行登出');
      if (globalLogoutCallback) {
        globalLogoutCallback();
      }
    }
    
    return Promise.reject(error);
  }
);