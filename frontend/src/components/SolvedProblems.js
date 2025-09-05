import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const SolvedProblems = () => {
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSolved, setTotalSolved] = useState(0);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const problemsPerPage = 10;

  useEffect(() => {
    fetchSolvedProblems();
  }, [currentPage]);

  const fetchSolvedProblems = async () => {
    try {
      const response = await userAPI.getSolvedProblems({
        page: currentPage,
        limit: problemsPerPage
      });
      
      setSolvedProblems(response.data.solvedProblems || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalSolved(response.data.totalSolved || 0);
    } catch (error) {
      console.error('Failed to fetch solved problems:', error);
      setSolvedProblems([]);
    }
    setLoading(false);
  };

  const formatTime = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const viewCode = (problem) => {
    setSelectedProblem(problem);
    setShowCode(true);
    setShowReview(false);
  };

  const viewReview = (problem) => {
    setSelectedProblem(problem);
    setShowReview(true);
    setShowCode(false);
  };

  const closeModal = () => {
    setShowCode(false);
    setShowReview(false);
    setSelectedProblem(null);
  };

  if (loading) {
    return <div className="loading">Loading solved problems...</div>;
  }

  return (
    <div className="solved-problems">
      <div className="solved-header">
        <h3>✅ Solved Problems</h3>
        <span className="total-count">Total: {totalSolved} problems</span>
      </div>
      
      {solvedProblems.length === 0 ? (
        <div className="no-problems">
          <p>You haven't solved any problems yet.</p>
          <p>Solve some problems to see them here!</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn btn-primary"
          >
            Start Solving
          </button>
        </div>
      ) : (
        <>
          <div className="problems-list">
            {solvedProblems.map(problem => (
              <div key={problem._id} className="solved-problem-card">
                <div className="problem-main-info">
                  <h4>{problem.problemName}</h4>
                  <div className="problem-meta">
                    <span className="problem-rating">Rating: {problem.problemRating}</span>
                    <span className="problem-time">Time: {formatTime(problem.timeTaken)}</span>
                    <span className="problem-date">
                      {new Date(problem.attemptDate).toLocaleDateString()}
                    </span>
                    <span className="problem-language">{problem.language}</span>
                  </div>
                </div>
                
                <div className="problem-tags">
                  {problem.problemTags && problem.problemTags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                
                <div className="problem-actions">
                  <a
                    href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.problemIndex}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    View Problem
                  </a>
                  <button
                    onClick={() => viewCode(problem)}
                    className="btn btn-primary"
                  >
                    View My Code
                  </button>
                  <button
                    onClick={() => viewReview(problem)}
                    className="btn btn-secondary"
                    disabled={!problem.reviewFeedback}
                  >
                    View AI Review
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}

          {/* Code Modal */}
          {showCode && selectedProblem && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Your Code: {selectedProblem.problemName}</h3>
                  <button onClick={closeModal} className="modal-close">×</button>
                </div>
                <div className="code-display">
                  <pre>{selectedProblem.code}</pre>
                </div>
                <div className="modal-footer">
                  <button onClick={closeModal} className="btn btn-primary">Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Review Modal */}
          {showReview && selectedProblem && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>AI Review: {selectedProblem.problemName}</h3>
                  <button onClick={closeModal} className="modal-close">×</button>
                </div>
                <div className="review-display">
                  <div className="review-text">
                    {selectedProblem.reviewFeedback}
                  </div>
                </div>
                <div className="modal-footer">
                  <button onClick={closeModal} className="btn btn-primary">Close</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SolvedProblems;