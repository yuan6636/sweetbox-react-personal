import axios from 'axios';

import { getToken, logout } from './utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const mockToken = getToken();

  if (mockToken) {
    config.headers.Authorization = `Bearer ${mockToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // 清除 auth
      logout();

      // 導回登入頁
      window.location.href = `${import.meta.env.BASE_URL}#/login`;
    }

    return Promise.reject(error);
  },
);

export default api;
