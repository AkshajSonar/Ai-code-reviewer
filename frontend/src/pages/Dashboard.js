import React, { useState, useEffect } from 'react';
import { codeforcesAPI, userAPI } from '../services/api';
import Statistics from '../components/Statistics';
import BookmarkManager from '../components/BookmarkManager';
import SolvedProblems from '../components/SolvedProblems';
import Profile from '../components/Profile';

const Dashboard = () => {
  const [tags, setTags] = useState(['greedy', 'math']);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('problems');
  const [selectedRating, setSelectedRating] = useState(1500);

  useEffect(() => {
    fetchUserStats();
    fetchUserProfile();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await userAPI.getStats();
      setUserStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setUserStats({ 
        error: error.response?.data?.error || 'Failed to load statistics' 
      });
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setUserProfile(response.data.user);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
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
        tags.join(';'),
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

      {/* Rating Filter - Only show in Problems tab */}
      {activeTab === 'problems' && (
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
      )}

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
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
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
                    href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    View on Codeforces
                  </a>
                  <a 
                    href={`/solve?contestId=${problem.contestId}&index=${problem.index}&name=${encodeURIComponent(problem.name)}&rating=${problem.rating || 1500}`}
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

        {activeTab === 'stats' && (
          <div className="stats-tab">
            {!userStats ? (
              <div>Loading statistics...</div>
            ) : userStats.error ? (
              <div className="error-message">
                Failed to load statistics: {userStats.error}
              </div>
            ) : (
              <Statistics 
                stats={userStats.stats}
                byTag={userStats.byTag}
                byRating={userStats.byRating}
              />
            )}
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <BookmarkManager />
        )}

        {activeTab === 'profile' && userProfile && (
          <Profile user={userProfile} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;