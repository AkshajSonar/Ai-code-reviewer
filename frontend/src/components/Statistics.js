import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const Statistics = ({ stats, byTag, byRating }) => {
  const [ratingData, setRatingData] = useState([]);
  const [timeData, setTimeData] = useState([]);

  useEffect(() => {
    if (byRating) {
      // Prepare data for rating histogram
      const ratingHistogram = Object.entries(byRating)
        .filter(([rating]) => rating !== 'undefined')
        .map(([rating, data]) => ({
          rating: parseInt(rating),
          solved: data.solved,
          attempted: data.attempted
        }))
        .sort((a, b) => a.rating - b.rating);

      setRatingData(ratingHistogram);
      
      // Prepare data for time histogram (mock data - you'd need actual time data)
      const timeHistogram = ratingHistogram.map(item => ({
        rating: item.rating,
        avgTime: Math.random() * 30 + 5 // Mock average time in minutes
      }));
      
      setTimeData(timeHistogram);
    }
  }, [byRating]);

  const maxSolved = ratingData.length > 0 ? Math.max(...ratingData.map(item => item.solved)) : 0;
  const maxTime = timeData.length > 0 ? Math.max(...timeData.map(item => item.avgTime)) : 0;

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

      {/* Problems by Rating Histogram */}
      <div className="stats-section">
        <h4>Problems Solved by Rating</h4>
        <div className="histogram">
          {ratingData.map(item => (
            <div key={item.rating} className="histogram-bar-container">
              <div 
                className="histogram-bar"
                style={{ 
                  height: `${(item.solved / maxSolved) * 150}px`,
                  width: '30px'
                }}
                title={`Rating ${item.rating}: ${item.solved} solved`}
              >
                <span className="bar-label">{item.solved}</span>
              </div>
              <span className="bar-title">{item.rating}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Average Time by Rating Histogram */}
      <div className="stats-section">
        <h4>Average Time Taken by Rating</h4>
        <div className="histogram">
          {timeData.map(item => (
            <div key={item.rating} className="histogram-bar-container">
              <div 
                className="histogram-bar time-bar"
                style={{ 
                  height: `${(item.avgTime / maxTime) * 150}px`,
                  width: '30px'
                }}
                title={`Rating ${item.rating}: ${item.avgTime.toFixed(1)} minutes avg`}
              >
                <span className="bar-label">{item.avgTime.toFixed(0)}m</span>
              </div>
              <span className="bar-title">{item.rating}</span>
            </div>
          ))}
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
    </div>
  );
};

export default Statistics;