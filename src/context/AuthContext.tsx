import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

interface User {
  id: number;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to get token from localStorage
  const getToken = () => localStorage.getItem("auth_token");

  // Set token to localStorage
  const setToken = (token: string) => localStorage.setItem("auth_token", token);

  // Remove token from localStorage
  const removeToken = () => localStorage.removeItem("auth_token");

  // Attach token to api instance
  useEffect(() => {
    const token = getToken();
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [user]);

  const fetchMe = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data?.token;
      if (token) {
        setToken(token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await fetchMe();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  if (loading) return null; // or loader

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
