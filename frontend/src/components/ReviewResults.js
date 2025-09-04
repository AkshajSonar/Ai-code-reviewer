import React, { useState } from 'react';

const ReviewResults = ({ review, code, problem, onTryAnother }) => {
  const [activeTab, setActiveTab] = useState('review');

  if (!review) {
    return (
      <div className="review-results">
        <div className="no-review">
          <h3>No review yet</h3>
          <p>Submit your code to get AI feedback</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-results">
      <div className="review-header">
        <h2>AI Code Review Results</h2>
        <div className="review-tabs">
          <button 
            className={activeTab === 'review' ? 'active' : ''}
            onClick={() => setActiveTab('review')}
          >
            Review
          </button>
          <button 
            className={activeTab === 'code' ? 'active' : ''}
            onClick={() => setActiveTab('code')}
          >
            Your Code
          </button>
        </div>
      </div>

      <div className="review-content">
        {activeTab === 'review' ? (
          <div className="review-text">
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ 
                __html: review.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }}
            />
          </div>
        ) : (
          <div className="code-display">
            <pre>{code}</pre>
          </div>
        )}
      </div>

      <div className="review-actions">
        <button onClick={onTryAnother} className="btn btn-primary">
          Try Another Problem
        </button>
      </div>
    </div>
  );
};

export default ReviewResults;