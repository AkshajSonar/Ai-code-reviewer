import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import ProblemDisplay from '../components/ProblemDisplay';
import ReviewResults from '../components/ReviewResults';
import { codeforcesAPI } from '../services/api';
import { getUser } from '../services/auth';

const ProblemSolve = () => {
  const [searchParams] = useSearchParams();
  const [problem, setProblem] = useState(null);
  const [review, setReview] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [problemRating, setProblemRating] = useState(1500);
  const [solved, setSolved] = useState(false);
  const [language, setLanguage] = useState('python');
  const [submitting, setSubmitting] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [savedAttempt, setSavedAttempt] = useState(null);
  const [showBookmarkOptions, setShowBookmarkOptions] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const user = getUser();

  useEffect(() => {
    const fetchProblem = async () => {
      const contestId = searchParams.get('contestId');
      const problemIndex = searchParams.get('index');
      const problemName = searchParams.get('problem');
      const rating = searchParams.get('rating');
      const tags = searchParams.get('tags');

      if (contestId && problemIndex) {
        setLoading(true);
        try {
          setProblem({
            contestId,
            index: problemIndex,
            name: problemName || `Problem ${contestId}${problemIndex}`,
            tags: tags ? tags.split(',') : ['algorithm', 'coding'],
            rating: parseInt(rating) || 1500
          });
          setProblemRating(parseInt(rating) || 1500);
        } catch (error) {
          console.error('Failed to fetch problem:', error);
        }
        setLoading(false);
      }
    };

    fetchProblem();
    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [searchParams]);

  const startTimer = () => {
    if (!isTimerRunning) {
      startTimeRef.current = Date.now();
      setIsTimerRunning(true);
      
      timerRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeTaken(elapsedSeconds);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isTimerRunning && timerRef.current) {
      clearInterval(timerRef.current);
      setIsTimerRunning(false);
      const finalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimeTaken(finalTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReviewComplete = async (reviewText, code) => {
    stopTimer();
    setReview(reviewText);
    setUserCode(code);
    
    if (problem) {
      await saveProblemAttempt(code, reviewText);
    }
  };

  const saveProblemAttempt = async (code, reviewFeedback = '') => {
  if (!problem) return;

  setSubmitting(true);
  try {
    const response = await codeforcesAPI.saveAttempt({
      contestId: problem.contestId,
      problemIndex: problem.index,
      problemName: problem.name,
      problemTags: problem.tags,
      problemRating: problemRating,
      solved: solved,
      timeTaken: timeTaken,
      code: code,
      language: language,
      reviewFeedback: reviewFeedback
    });
    
    if (response.data.success) {
      setSavedAttempt(response.data.attempt);
      setShowBookmarkOptions(true);
      return true;
    }
  } catch (error) {
    console.error('Failed to save attempt:', error);
    alert('Failed to save your attempt. Please try again.');
  }
  setSubmitting(false);
  return false;
};

  const handleBookmark = async () => {
    try {
      await codeforcesAPI.bookmarkProblem({
        contestId: problem.contestId,
        problemIndex: problem.index,
        problemName: problem.name,
        problemTags: problem.tags,
        problemRating: problemRating
      });
      alert('Problem bookmarked successfully!');
    } catch (error) {
      console.error('Failed to bookmark:', error);
      alert('Failed to bookmark problem.');
    }
  };

  const handleSaveWithoutReview = async () => {
    if (!userCode) {
      alert('Please write some code first');
      return;
    }
    
    stopTimer();
    await saveProblemAttempt(userCode);
  };

  const handleTryAnother = () => {
    setReview(null);
    setUserCode('');
    setSavedAttempt(null);
    setShowBookmarkOptions(false);
    window.location.href = '/';
  };

  const openCodeforces = () => {
    if (problem) {
      window.open(`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`, '_blank');
    }
  };

  if (loading) {
    return <div className="loading">Loading problem...</div>;
  }

  return (
    <div className="problem-solve-page">
      <div className="solve-header">
        <div className="header-user">
          {user?.avatar && (
            <img src={user.avatar} alt={user.name} className="user-avatar" />
          )}
          <div>
            <h1>Solve Coding Problem</h1>
            <p>Write your solution and get instant AI feedback</p>
          </div>
        </div>
        
        <div className="timer-section">
          <div className="timer-display">
            <span className="timer-label">Time Elapsed:</span>
            <span className="timer-value">{formatTime(timeTaken)}</span>
          </div>
          <div className="timer-controls">
            {isTimerRunning ? (
              <button onClick={stopTimer} className="btn btn-secondary">
                ⏹️ Stop Timer
              </button>
            ) : (
              <button onClick={startTimer} className="btn btn-primary">
                ▶️ Start Timer
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="solve-content">
        <div className="problem-column">
          <ProblemDisplay problem={problem} />
          
          {/* Problem Actions */}
          <div className="problem-actions">
            <button onClick={openCodeforces} className="btn btn-secondary">
              📖 View on Codeforces
            </button>
            
            {showBookmarkOptions && (
              <button onClick={handleBookmark} className="btn btn-primary">
                ⭐ Bookmark Problem
              </button>
            )}
          </div>

          {/* Solution Metadata Form */}
          <div className="solution-meta">
            <h3>Solution Details</h3>
            <div className="meta-form">
              <div className="form-group">
                <label>Time Taken:</label>
                <div className="time-display">
                  {formatTime(timeTaken)}
                </div>
              </div>
              
              <div className="form-group">
                <label>Problem Rating:</label>
                <div className="rating-display">
                  {problemRating}
                </div>
              </div>
              
              <div className="form-group">
                <label>Problem Tags:</label>
                <div className="tags-display">
                  {problem?.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={solved}
                    onChange={(e) => setSolved(e.target.checked)}
                  />
                  I solved this problem
                </label>
              </div>

              <div className="form-group">
                <label>Programming Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                </select>
              </div>
            </div>

            <div className="meta-actions">
              <button 
                onClick={handleSaveWithoutReview}
                disabled={submitting || !userCode}
                className="btn btn-primary"
              >
                {submitting ? 'Saving...' : '💾 Save Solution'}
              </button>
              
              {savedAttempt && (
                <div className="save-success">
                  ✅ Solution saved successfully! ({new Date(savedAttempt.attemptDate).toLocaleTimeString()})
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="editor-column">
          <CodeEditor 
            problem={problem}
            onReviewComplete={handleReviewComplete}
            onLanguageChange={setLanguage}
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