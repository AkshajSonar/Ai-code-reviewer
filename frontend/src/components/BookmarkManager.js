import React, { useState, useEffect } from 'react';
import { codeforcesAPI } from '../services/api';

const BookmarkManager = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await codeforcesAPI.getBookmarks();
      setBookmarks(response.data.bookmarks || []);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    }
    setLoading(false);
  };

  const removeBookmark = async (contestId, problemIndex) => {
    try {
      await codeforcesAPI.removeBookmark(contestId, problemIndex);
      setBookmarks(bookmarks.filter(b => 
        !(b.contestId === contestId && b.problemIndex === problemIndex)
      ));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  if (loading) return <div>Loading bookmarks...</div>;

  return (
    <div className="bookmark-manager">
      <h3>Bookmarked Problems</h3>
      
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet. Bookmark problems to see them here.</p>
      ) : (
        <div className="bookmarks-list">
          {bookmarks.map(bookmark => (
            <div key={`${bookmark.contestId}-${bookmark.problemIndex}`} className="bookmark-item">
              <div className="bookmark-info">
                <h4>{bookmark.problemName}</h4>
                <p>Rating: {bookmark.problemRating} • {bookmark.problemTags.join(', ')}</p>
              </div>
              <div className="bookmark-actions">
                <a
                  href={`https://codeforces.com/problemset/problem/${bookmark.contestId}/${bookmark.problemIndex}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  Solve
                </a>
                <button
                  onClick={() => removeBookmark(bookmark.contestId, bookmark.problemIndex)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkManager;