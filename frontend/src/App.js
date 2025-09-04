import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import ProblemSolve from './pages/ProblemSolve';
import Profile from './pages/Profile';
import { isAuthenticated, getUser, handleAuthCallback } from './services/auth';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      if (handleAuthCallback()) {
        const userData = getUser();
        setUser(userData);
      } 
      else if (isAuthenticated()) {
        const userData = getUser();
        setUser(userData);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Header user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Dashboard /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/solve" 
              element={user ? <ProblemSolve /> : <Navigate to="/" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile /> : <Navigate to="/" />} 
            />
            <Route path="/auth/success" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;