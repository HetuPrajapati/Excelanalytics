"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Validate token with backend
        authAPI
          .getMe()
          .then((response) => {
            setUser(response.data.data);
          })
          .catch((error) => {
            console.error("Token validation failed:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
        setUser(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, data } = response.data;

      if (token && data) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
      }

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
      return { success: false, message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, data } = response.data;

      if (token && data) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
      }

      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout(); // Optional: backend logout
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
