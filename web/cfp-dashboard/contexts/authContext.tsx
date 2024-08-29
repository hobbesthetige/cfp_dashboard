"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { baseURL } from "./axios";
import axios, { AxiosError, AxiosResponse } from "axios";

type TokenString = string;

interface AuthContextProps {
  token: string | undefined;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<
    { token: string; error?: undefined } | { error: Error; token?: undefined }
  >;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const validateToken = useCallback(async (token: string) => {
    const api = axios.create({ baseURL });
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await api.get("/auth/validate");
      return response.status === 200;
    } catch (err) {
      return false;
    }
  }, []);

  const storeToken = useCallback((token: TokenString) => {
    localStorage.setItem("token", token);
    setToken(token);
    setIsAuthenticated(true);
  }, []);

  const removeToken = useCallback(() => {
    localStorage.removeItem("token");
    setToken(undefined);
    setIsAuthenticated(false);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    router.push("/login");
  }, [removeToken, router]);

  const login = useCallback(
    async (username: string, password: string) => {
      setLoading(true);

      const api = axios.create({ baseURL });

      try {
        const response = await api
          .post("/auth/login", {
            username,
            password,
          })
          .then(
            (response: AxiosResponse<{ token: TokenString }>) => response.data
          );

        const { token } = response;
        storeToken(token);

        return { token };
      } catch (err) {
        setLoading(false);
        removeToken();
        const error = new Error("Invalid username or password");
        return { error };
      } finally {
        setLoading(false);
      }
    },
    [removeToken, storeToken]
  );

  const validateLocaleStorageToken = useCallback(async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const isTokenValid = await validateToken(storedToken);
      if (isTokenValid) {
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, [validateToken, logout]);

  // Validate token on mount every 60 seconds
  useEffect(() => {
    const interval = setInterval(validateLocaleStorageToken, 60000); // 60 seconds
    validateLocaleStorageToken();
    return () => {
      clearInterval(interval);
    };
  }, [validateLocaleStorageToken]);

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
