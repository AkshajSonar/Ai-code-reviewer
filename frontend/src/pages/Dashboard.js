import React, { useState, useEffect } from 'react';
import { codeforcesAPI, userAPI } from '../services/api';

const Dashboard = () => {
  const [tags, setTags] = useState(['greedy', 'math']);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await userAPI.getStats();
      setUserStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRandomProblem = async () => {
    if (tags.length === 0) {
      alert('Please select at least one tag');
      return;
    }

    setLoading(true);
    try {
      const response = await codeforcesAPI.getRandomProblem(tags.join(','));
      setProblem(response.data.problem);
    } catch (error) {
      console.error('Failed to fetch problem:', error);
      alert('Failed to fetch problem. Please try again.');
    }
    setLoading(false);
  };

  const handleTagToggle = (tag) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const commonTags = ['greedy', 'math', 'dp', 'graphs', 'strings', 'data structures', 'trees', 'sortings'];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to CodeCraft AI</h1>
        <p>Select tags and get a random coding problem to solve</p>
      </div>

      <div className="dashboard-content">
        <div className="tags-section">
          <h3>Select Problem Tags:</h3>
          <div className="tags-container">
            {commonTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`tag ${tags.includes(tag) ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
          
          <button 
            onClick={fetchRandomProblem}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Loading...' : 'Get Random Problem'}
          </button>
        </div>

        {problem && (
          <div className="problem-section">
            <h3>Your Problem:</h3>
            <div className="problem-card">
              <h4>{problem.name}</h4>
              <p>Difficulty: {problem.rating || 'Unknown'}</p>
              <div className="problem-tags">
                {problem.tags?.map(tag => (
                  <span key={tag} className="problem-tag">{tag}</span>
                ))}
              </div>
              <a 
                href={problem.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                View on Codeforces
              </a>
              <a 
                href={`/solve?problem=${encodeURIComponent(problem.name)}&contestId=${problem.contestId}&index=${problem.index}`}
                className="btn btn-primary"
              >
                Solve This Problem
              </a>
            </div>
          </div>
        )}

        {userStats && (
          <div className="stats-section">
            <h3>Your Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total Attempts</h4>
                <p>{userStats.stats?.totalAttempts || 0}</p>
              </div>
              <div className="stat-card">
                <h4>Solved Problems</h4>
                <p>{userStats.stats?.solvedProblems || 0}</p>
              </div>
              <div className="stat-card">
                <h4>Success Rate</h4>
                <p>{userStats.stats?.successRate || 0}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;