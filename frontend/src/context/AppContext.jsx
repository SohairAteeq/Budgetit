import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl, ApiEndPoints } from "../util/ApiEndPoints.js";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const navigate = useNavigate();

  const publicRoutes = ["/home", "/login", "/signup"];

  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) {
      setSidebarOpen(saved === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen);
  }, [sidebarOpen]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;

    if (token) {
      fetch(`${baseUrl}${ApiEndPoints.authCheck}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then((data) => {
          setUser(data);
          if (!publicRoutes.includes(currentPath)) {
            navigate("/dashboard");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
          if (!publicRoutes.includes(currentPath)) {
            navigate("/home");
          }
        });
    } else {
      if (!publicRoutes.includes(currentPath)) {
        navigate("/home");
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, sidebarOpen, setSidebarOpen }}>
      {children}
    </AppContext.Provider>
  );
};