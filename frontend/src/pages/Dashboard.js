import React, { useState, useEffect } from 'react';
import { codeforcesAPI, userAPI } from '../services/api';
import Statistics from '../components/Statistics';
import BookmarkManager from '../components/BookmarkManager';
import SolvedProblems from '../components/SolvedProblems';

const Dashboard = () => {
  const [tags, setTags] = useState(['greedy', 'math']);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [activeTab, setActiveTab] = useState('problems');
  const [selectedRating, setSelectedRating] = useState(1500);

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
      const response = await codeforcesAPI.getRandomProblem(
        tags.join(','),
        selectedRating
      );
      
      if (response.data.error) {
        alert(response.data.error + (response.data.suggestion ? '\n' + response.data.suggestion : ''));
      } else {
        setProblem(response.data.problem);
      }
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

      {/* Rating Filter - Moved to top */}
      <div className="rating-filter">
        <h4>Filter by Rating:</h4>
        <div className="rating-slider">
          <input
            type="range"
            min="800"
            max="3500"
            step="100"
            value={selectedRating}
            onChange={(e) => setSelectedRating(parseInt(e.target.value))}
          />
          <span className="rating-value">{selectedRating}</span>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'problems' ? 'active' : ''}
          onClick={() => setActiveTab('problems')}
        >
          Problems
        </button>
        <button 
          className={activeTab === 'solved' ? 'active' : ''}
          onClick={() => setActiveTab('solved')}
        >
          Solved Problems
        </button>
        <button 
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button 
          className={activeTab === 'bookmarks' ? 'active' : ''}
          onClick={() => setActiveTab('bookmarks')}
        >
          Bookmarks
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'problems' && (
          <>
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
                    href={`/solve?problem=${encodeURIComponent(problem.name)}&contestId=${problem.contestId}&index=${problem.index}&rating=${problem.rating || 1500}&tags=${problem.tags?.join(',') || ''}`}
                    className="btn btn-primary"
                  >
                    Solve This Problem
                  </a>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'solved' && (
          <SolvedProblems />
        )}

        {activeTab === 'stats' && userStats && (
          <Statistics 
            stats={userStats.stats}
            byTag={userStats.byTag}
            byRating={userStats.byRating}
          />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarkManager />
        )}
      </div>
    </div>
  );
};

export default Dashboard;