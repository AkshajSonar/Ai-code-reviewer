import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const Profile = () => {
  const [userStats, setUserStats] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [statsResponse, attemptsResponse] = await Promise.all([
        userAPI.getStats(),
        userAPI.getAttempts()
      ]);
      
      setUserStats(statsResponse.data);
      setAttempts(attemptsResponse.data.attempts || []);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Track your progress and coding statistics</p>
      </div>

      {userStats && (
        <div className="stats-section">
          <h2>Performance Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Attempts</h3>
              <p className="stat-number">{userStats.stats?.totalAttempts || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Solved Problems</h3>
              <p className="stat-number">{userStats.stats?.solvedProblems || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Success Rate</h3>
              <p className="stat-number">{userStats.stats?.successRate || 0}%</p>
            </div>
            <div className="stat-card">
              <h3>Average Time</h3>
              <p className="stat-number">{userStats.stats?.avgTime || 0}m</p>
            </div>
          </div>
        </div>
      )}

      <div className="attempts-section">
        <h2>Recent Attempts</h2>
        {attempts.length > 0 ? (
          <div className="attempts-list">
            {attempts.map(attempt => (
              <div key={attempt._id} className="attempt-card">
                <h4>{attempt.problemName}</h4>
                <div className="attempt-details">
                  <span className={`status ${attempt.solved ? 'solved' : 'unsolved'}`}>
                    {attempt.solved ? 'Solved' : 'Unsolved'}
                  </span>
                  <span className="time">Time: {attempt.timeTaken}m</span>
                  <span className="date">
                    {new Date(attempt.attemptDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="problem-tags">
                  {attempt.problemTags?.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No attempts yet. Start solving problems to see your progress!</p>
        )}
      </div>
    </div>
  );
};

export default Profile;