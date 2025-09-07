// import React, { useState, useEffect } from 'react';
// import { codeforcesAPI } from '../services/api';

// const BookmarkManager = () => {
//   const [bookmarks, setBookmarks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchBookmarks();
//   }, []);

//   const fetchBookmarks = async () => {
//     try {
//       const response = await codeforcesAPI.getBookmarks();
//       setBookmarks(response.data.bookmarks || []);
//     } catch (error) {
//       console.error('Failed to fetch bookmarks:', error);
//     }
//     setLoading(false);
//   };

//   const removeBookmark = async (contestId, problemIndex) => {
//     try {
//       await codeforcesAPI.removeBookmark(contestId, problemIndex);
//       setBookmarks(bookmarks.filter(b => 
//         !(b.contestId === contestId && b.problemIndex === problemIndex)
//       ));
//     } catch (error) {
//       console.error('Failed to remove bookmark:', error);
//     }
//   };

//   if (loading) return <div>Loading bookmarks...</div>;

//   return (
//     <div className="bookmark-manager">
//       <h3>Bookmarked Problems</h3>
      
//       {bookmarks.length === 0 ? (
//         <p>No bookmarks yet. Bookmark problems to see them here.</p>
//       ) : (
//         <div className="bookmarks-list">
//           {bookmarks.map(bookmark => (
//             <div key={`${bookmark.contestId}-${bookmark.problemIndex}`} className="bookmark-item">
//               <div className="bookmark-info">
//                 <h4>{bookmark.problemName}</h4>
//                 <p>Rating: {bookmark.problemRating} • {bookmark.problemTags.join(', ')}</p>
//               </div>
//               <div className="bookmark-actions">
//                 <a
//                   href={`https://codeforces.com/problemset/problem/${bookmark.contestId}/${bookmark.problemIndex}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="btn btn-secondary"
//                 >
//                   Solve
//                 </a>
//                 <button
//                   onClick={() => removeBookmark(bookmark.contestId, bookmark.problemIndex)}
//                   className="btn btn-danger"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookmarkManager;
import React, { useState, useEffect } from 'react';
import { codeforcesAPI } from '../services/api';

const BookmarkManager = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  // Add a state for error messages to show to the user
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await codeforcesAPI.getBookmarks();
      setBookmarks(response.data.bookmarks || []);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
      setError('Failed to load bookmarks.');
    }
    setLoading(false);
  };

  const removeBookmark = async (contestId, problemIndex) => {
    // DEBUG 1: Log what we're trying to delete
    console.log("Trying to remove:", contestId, problemIndex);

    try {
      // DEBUG 2: Capture the API response
      const response = await codeforcesAPI.removeBookmark(contestId, problemIndex);
      console.log("Delete successful:", response.data); // Should see { message: 'Bookmark removed successfully' }

      // Update the UI on success
      setBookmarks(bookmarks.filter(b => 
        !(b.contestId === contestId && b.problemIndex === problemIndex)
      ));

    } catch (error) {
      // DEBUG 3: GREATLY ENHANCED ERROR LOGGING
      console.error('DELETE Request Failed:');
      console.error('- Full Error:', error);
      console.error('- HTTP Status Code:', error.response?.status); // e.g., 401, 404, 500
      console.error('- Server Error Message:', error.response?.data?.error); // The message from your backend
      console.error('- Request URL:', error.config?.url); // The URL that was called

      // Show a user-friendly error message based on the response
      if (error.response?.status === 401) {
        setError('Your session expired. Please log in again.');
      } else if (error.response?.status === 404) {
        setError('Bookmark not found. It may have already been deleted.');
        // Optional: Remove it from the local state anyway to keep UI clean
        setBookmarks(bookmarks.filter(b => 
          !(b.contestId === contestId && b.problemIndex === problemIndex)
        ));
      } else {
        // Show the server's error message or a generic one
        setError(error.response?.data?.error || 'Failed to remove bookmark. Please try again.');
      }
    }
  };

  if (loading) return <div>Loading bookmarks...</div>;

  return (
    <div className="bookmark-manager">
      <h3>Bookmarked Problems</h3>
      {/* Display error message to the user */}
      {error && <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>{error}</div>}
      
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