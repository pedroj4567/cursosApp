// contexts/AuthContext.tsx
import { createContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authServices } from "../services";
import { useAuth } from "../hooks/useAuth";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("jwt");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { jwt, user } = await authServices.login({ email, password });

      localStorage.setItem("jwt", jwt);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      navigate("/courses");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      setIsLoading(true);
      const { jwt, user } = await authServices.register({
        username,
        email,
        password,
      });

      localStorage.setItem("jwt", jwt);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      navigate("/courses");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null;
};
