import React from 'react';

const ProblemDisplay = ({ problem }) => {
  if (!problem) {
    return (
      <div className="problem-display">
        <div className="no-problem">
          <h3>No problem selected</h3>
          <p>Choose tags and get a random problem from the dashboard</p>
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
            <span className="problem-difficulty">
              Difficulty: {problem.rating}
            </span>
          )}
          {problem.contestId && (
            <span className="problem-id">
              Contest: {problem.contestId}, Problem: {problem.index}
            </span>
          )}
        </div>
      </div>

      <div className="problem-tags">
        {problem.tags?.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {problem.url && (
        <div className="problem-actions">
          <a 
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            View on Codeforces
          </a>
        </div>
      )}

      <div className="problem-description">
        <h4>Problem Description:</h4>
        <p>
          This problem is from Codeforces. Please visit the link above to read
          the full problem statement, input/output specifications, and examples.
        </p>
      </div>
    </div>
  );
};

export default ProblemDisplay;