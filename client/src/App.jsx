
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }, []);

      const handleLogin = (userData) => {
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
      };

      const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterForm />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={user ? <Navigate to="/dashboard"/> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;