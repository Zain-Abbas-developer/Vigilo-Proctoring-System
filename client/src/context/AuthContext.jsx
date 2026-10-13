import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authApi } from "../services/authApi.js";
import { ROLES, ROLE_DASHBOARD } from "../constant/roles.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("vigilo_user")) || null; } 
    catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("vigilo_token") || null);
  const [loading, setLoading] = useState(() => {
    return Boolean(localStorage.getItem("vigilo_token"));
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('vigilo_token');
    if (!storedToken) { setLoading(false); return; }
    setLoading(true);
    authApi.me()
      .then((user) => {setUser(user); setToken(storedToken); localStorage.setItem('vigilo_user', JSON.stringify(user)); })
      .catch(() => { localStorage.removeItem('vigilo_token'); localStorage.removeItem('vigilo_user'); setUser(null); setToken(null); })
      .finally(() => setLoading(false));
  }, []);


  // Login
  const login = async ({ email, password }) => {
    const {user, token} = await authApi.login({ email, password });
    localStorage.setItem("vigilo_token", token);
    localStorage.setItem("vigilo_user", JSON.stringify(user));
    setToken(token);
    setUser(user);


    return user;
  };

  // Register
  const register = async (payload) => {
    const {user, token } = await authApi.register(payload);
    localStorage.setItem("vigilo_token", token);
    localStorage.setItem("vigilo_user", JSON.stringify(user));
    setToken(token);
    setUser(user);

    return user;
  };

  // Logout
  const logout = async () => {
    try { await authApi.logout();} catch {}
    localStorage.removeItem("vigilo_token");
    localStorage.removeItem("vigilo_user");
    setToken(null);
    setUser(null);
  };

  //user dashbaord routes
  const isAdmin = useCallback(() => user?.role === ROLES.ADMIN, [user]);
  const isTeacher = useCallback(() => user?.role === ROLES.TEACHER, [user]);
  const isStudent = useCallback(() => user?.role === ROLES.STUDENT, [user]);

  const getDashboardRoute = useCallback(() => {
    if(!user) return '/login';
    return ROLE_DASHBOARD[user?.role] || '/login'; 
  }, [user]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isTeacher,
    isStudent,
    getDashboardRoute,
    setUser,
  }), [user, token, loading, isAdmin, isTeacher, isStudent, getDashboardRoute ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
};

export default AuthContext;