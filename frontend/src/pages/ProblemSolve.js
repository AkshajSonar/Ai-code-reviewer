import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import ProblemDisplay from '../components/ProblemDisplay';
import ReviewResults from '../components/ReviewResults';
import { codeforcesAPI } from '../services/api';

const ProblemSolve = () => {
  const [searchParams] = useSearchParams();
  const [problem, setProblem] = useState(null);
  const [review, setReview] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      const contestId = searchParams.get('contestId');
      const problemIndex = searchParams.get('index');
      const problemName = searchParams.get('problem');

      if (contestId && problemIndex) {
        setLoading(true);
        try {
          // creating a mock problem object
          // badme fetch from your backend
          setProblem({
            contestId,
            index: problemIndex,
            name: problemName || `Problem ${contestId}${problemIndex}`,
            tags: ['algorithm', 'coding'],
            rating: 1500
          });
        } catch (error) {
          console.error('Failed to fetch problem:', error);
        }
        setLoading(false);
      }
    };

    fetchProblem();
  }, [searchParams]);

  const handleReviewComplete = (reviewText, code) => {
    setReview(reviewText);
    setUserCode(code);
  };

  const handleTryAnother = () => {
    setReview(null);
    setUserCode('');
    window.location.href = '/';
  };

  if (loading) {
    return <div className="loading">Loading problem...</div>;
  }

  return (
    <div className="problem-solve-page">
      <div className="solve-header">
        <h1>Solve Coding Problem</h1>
        <p>Write your solution and get instant AI feedback</p>
      </div>

      <div className="solve-content">
        <div className="problem-column">
          <ProblemDisplay problem={problem} />
        </div>

        <div className="editor-column">
          <CodeEditor 
            problem={problem}
            onReviewComplete={handleReviewComplete}
          />
        </div>

        {review && (
          <div className="review-column">
            <ReviewResults 
              review={review}
              code={userCode}
              problem={problem}
              onTryAnother={handleTryAnother}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemSolve;