
import React from 'react';

const Statistics = ({ stats, byTag, byRating }) => {
  if (!stats) return <div>Loading statistics...</div>;

  return (
    <div className="statistics">
      <h3>Performance Statistics</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Attempts</h4>
          <p className="stat-number">{stats.totalAttempts}</p>
        </div>
        <div className="stat-card">
          <h4>Solved Problems</h4>
          <p className="stat-number">{stats.solvedProblems}</p>
        </div>
        <div className="stat-card">
          <h4>Success Rate</h4>
          <p className="stat-number">{stats.successRate}%</p>
        </div>
        <div className="stat-card">
          <h4>Avg Time</h4>
          <p className="stat-number">{stats.avgTime}m</p>
        </div>
      </div>

      {/* Problems by Tag */}
      <div className="stats-section">
        <h4>Performance by Tag</h4>
        <div className="tag-stats">
          {Object.entries(byTag).map(([tag, data]) => (
            <div key={tag} className="tag-stat-item">
              <span className="tag-name">{tag}</span>
              <span className="tag-numbers">
                {data.solved}/{data.attempted} ({data.attempted > 0 ? Math.round((data.solved / data.attempted) * 100) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Problems by Rating */}
      <div className="stats-section">
        <h4>Performance by Rating</h4>
        <div className="rating-stats">
          {Object.entries(byRating)
            .sort(([a], [b]) => a - b)
            .map(([rating, data]) => (
              <div key={rating} className="rating-stat-item">
                <span className="rating-value">{rating}</span>
                <span className="rating-numbers">
                  {data.solved}/{data.attempted}
                </span>
                <div className="rating-bar">
                  <div 
                    className="rating-progress" 
                    style={{ width: `${data.attempted > 0 ? (data.solved / data.attempted) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;