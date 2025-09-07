import React from 'react';
import { logout } from '../services/auth';

const Header = ({ user, onLogout }) => {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleAvatarError = (e) => {
    e.target.style.display = 'none';
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>CodeCraft AI</h1>
          <span>AI-Powered Code Reviews</span>
        </div>
        
        <nav className="nav">
          {user ? (
            <>
              <a href="/" className="nav-link">Dashboard</a>
              {/* <a href="/solve" className="nav-link">Solve Problems</a>
              <a href="/profile" className="nav-link">Profile</a> */}
              <div className="user-menu">
                {user.avatar && (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="user-avatar"
                    onError={handleAvatarError}
                  />
                )}
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <a href="/" className="nav-link">Home</a>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;