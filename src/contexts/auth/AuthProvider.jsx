import { useState } from 'react';
import { getUser, setAuth, logout as clearAuth } from '../../utils/auth';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  // 只在初始化時，取得使用者資訊
  const [user, setUser] = useState(() => getUser());

  // 登入
  const login = (userData, token) => {
    setAuth(userData, token);
    setUser(userData);
  };

  // 登出
  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLogin: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
