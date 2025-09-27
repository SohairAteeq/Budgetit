// App.jsx
import './App.css';
import React, { useEffect, useContext, useState } from 'react';
import { Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Filter from './pages/Filter.jsx';
import Income from './pages/Income.jsx';
import Expense from './pages/Expense.jsx';
import Category from './pages/Category.jsx';
import { Toaster } from 'react-hot-toast';
import axiosConfig from './util/axiosConfig.jsx';
import { AppContext } from './context/AppContext.jsx';
import { ApiEndPoints } from './util/ApiEndPoints';

function App() {
  const navigate = useNavigate();
  const { setUser, user } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const publicRoutes = ['/home', '/login', '/signup'];

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const currentPath = window.location.pathname;

      if (!token) {
        setLoading(false);
        if (!publicRoutes.includes(currentPath)) {
          navigate('/home', { replace: true });
        }
        return;
      }

      try {
        const res = await axiosConfig.get(ApiEndPoints.authCheck);
        console.log("Auth check response:", res.data);

        // Handle both { user: {...} } and direct {...}
        const userData = res.data.user || res.data;

        if (res.status === 200 && userData) {
          setUser(userData);
        } else {
          localStorage.removeItem('token');
          if (!publicRoutes.includes(currentPath)) {
            navigate('/home', { replace: true });
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem('token');
        if (!publicRoutes.includes(currentPath)) {
          navigate('/home', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    // only run if user not already in context
    if (!user) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [navigate, setUser, user]);

  // ProtectedRoute: only renders children if user exists
  const ProtectedRoute = () => {
    const { user } = useContext(AppContext);
    if (!user) {
      return <Navigate to="/home" replace />;
    }
    return <Outlet />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontSize: '0.85rem',
            padding: '8px 12px',
            borderRadius: '8px',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/category" element={<Category />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
