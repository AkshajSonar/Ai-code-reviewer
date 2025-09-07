import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const Profile = ({ user }) => {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await userAPI.getStats();
      setUserStats(response.data);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      setError('Failed to load statistics');
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-info">
          {user?.avatar && (
            <img src={user.avatar} alt={user.name} className="profile-avatar" />
          )}
          <div className="profile-details">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <span className="member-since">
              Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {userStats && (
        <div className="profile-stats">
          <h3>Your Coding Statistics</h3>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <h4>Total Attempts</h4>
              <p className="stat-number">{userStats.stats?.totalAttempts || 0}</p>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <h4>Solved Problems</h4>
              <p className="stat-number">{userStats.stats?.solvedProblems || 0}</p>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <h4>Success Rate</h4>
              <p className="stat-number">{userStats.stats?.successRate || 0}%</p>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <h4>Avg Time</h4>
              <p className="stat-number">{userStats.stats?.avgTime || 0}m</p>
            </div>
          </div>

          {/* Top Tags */}
          <div className="top-tags">
            <h4>Your Top Tags</h4>
            <div className="tags-list">
              {userStats.byTag && Object.entries(userStats.byTag)
                .sort(([,a], [,b]) => b.solved - a.solved)
                .slice(0, 5)
                .map(([tag, data]) => (
                  <div key={tag} className="tag-item">
                    <span className="tag-name">{tag}</span>
                    <span className="tag-stats">
                      {data.solved} solved ({data.attempted} attempts)
                    </span>
                    <div className="tag-progress">
                      <div 
                        className="progress-bar"
                        style={{ width: `${data.attempted > 0 ? (data.solved / data.attempted) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="rating-distribution">
            <h4>Problems by Rating</h4>
            <div className="rating-list">
              {userStats.byRating && Object.entries(userStats.byRating)
                .sort(([a], [b]) => a - b)
                .map(([rating, data]) => (
                  <div key={rating} className="rating-item">
                    <span className="rating-value">{rating}</span>
                    <span className="rating-stats">
                      {data.solved || 0}/{data.attempted || 0}
                    </span>
                    <div className="rating-progress">
                      <div 
                        className="progress-bar"
                        style={{ width: `${data.attempted > 0 ? (data.solved / data.attempted) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {userStats?.recentAttempts && userStats.recentAttempts.length > 0 && (
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {userStats.recentAttempts.map(attempt => (
              <div key={attempt._id} className="activity-item">
                <div className="activity-problem">
                  <h5>{attempt.problemName}</h5>
                  <span className={`status ${attempt.solved ? 'solved' : 'unsolved'}`}>
                    {attempt.solved ? 'Solved' : 'Attempted'}
                  </span>
                </div>
                <div className="activity-details">
                  <span>Rating: {attempt.problemRating || 'N/A'}</span>
                  <span>Time: {attempt.timeTaken || 'N/A'}m</span>
                  <span>{new Date(attempt.attemptDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;