import React from 'react';

const ProblemDisplay = ({ problem }) => {
  if (!problem) {
    return (
      <div className="problem-display">
        <div className="no-problem">
          <h3>No problem selected</h3>
          <p>Choose a problem from the dashboard to start solving</p>
        </div>
      </div>
    );
  }

  return (
    <div className="problem-display">
      <div className="problem-header">
        <h2>{problem.name}</h2>
        <div className="problem-meta">
          {problem.rating && (
            <span className="problem-rating">
              ⚡ Rating: {problem.rating}
            </span>
          )}
          {problem.contestId && (
            <span className="problem-id">
              # {problem.contestId}{problem.index}
            </span>
          )}
        </div>
      </div>

      <div className="problem-tags">
        {problem.tags?.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className="problem-description">
        <h4>📋 Problem Description</h4>
        <p>
          This is a coding problem from Codeforces. Click "View on Codeforces" 
          to see the complete problem statement, input/output examples, 
          and constraints.
        </p>
        
        <div className="problem-stats">
          <h5>📊 Problem Statistics</h5>
          <ul>
            <li>• Rating: {problem.rating || 'Not specified'}</li>
            <li>• Tags: {problem.tags?.join(', ') || 'Not specified'}</li>
            <li>• Contest: {problem.contestId || 'Unknown'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProblemDisplay;