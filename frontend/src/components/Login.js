import React from 'react';
import { authAPI } from '../services/api';
import { login } from '../services/auth';

const Login = ({ onLogin }) => {
  const handleTestLogin = async () => {
    try {
      const response = await authAPI.loginWithToken();
      const { user, token } = response.data;
      
      login(token, user);
      onLogin(user, token);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check the console for details.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>CodeCraft AI</h1>
        <p>AI-Powered Code Review Platform</p>
        
        <div className="login-options">
          <button onClick={handleTestLogin} className="btn btn-primary">
            Sign In with Test Account
          </button>
          
          <div className="divider">OR</div>
          
          <button 
            onClick={() => window.location.href = 'http://localhost:5001/auth/google'}
            className="btn btn-google"
          >
            Sign In with Google
          </button>
        </div>

        <div className="features">
          <h3>Features:</h3>
          <ul>
            <li>✓ AI-Powered Code Reviews</li>
            <li>✓ Real Codeforces Problems</li>
            <li>✓ Performance Tracking</li>
            <li>✓ Personalized Feedback</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;