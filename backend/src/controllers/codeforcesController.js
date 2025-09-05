const axios = require('axios');
const ProblemAttempt = require('../models/ProblemAttempt');
const BookmarkedProblem = require('../models/BookmarkedProblem');

// Get problems by tags from Codeforces
exports.getProblemsByTags = async (req, res) => {
  try {
    const { tags } = req.query;
    
    if (!tags) {
      return res.status(400).json({ error: 'Tags parameter is required' });
    }
    
    const response = await axios.get(
      'https://codeforces.com/api/problemset.problems',
      {
        params: { tags }
      }
    );
    
    if (response.data.status !== 'OK') {
      return res.status(500).json({ error: 'Failed to fetch problems from Codeforces' });
    }
    
    const problems = response.data.result.problems;
    
    // Filter out problems without contestId and index
    const validProblems = problems.filter(problem => problem.contestId && problem.index);
    
    res.json({ problems: validProblems });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.saveProblemAttempt = async (req, res) => {
  try {
    const {
      contestId,
      problemIndex,
      problemName,
      problemTags,
      problemRating,
      solved, // This might be undefined or null
      timeTaken,
      code,
      language,
      reviewFeedback
    } = req.body;

    // Generate problemId from contestId and problemIndex
    const problemId = `${contestId}${problemIndex}`;

    // Ensure solved is always a boolean
    const isSolved = Boolean(solved);
    
    console.log('Saving attempt - solved:', solved, 'converted to:', isSolved);

    // Check if attempt already exists
    const existingAttempt = await ProblemAttempt.findOne({
      user: req.user._id,
      contestId,
      problemIndex
    });

    let attempt;

    if (existingAttempt) {
      // Update existing attempt
      existingAttempt.solved = isSolved; // Use the converted boolean
      existingAttempt.timeTaken = timeTaken;
      existingAttempt.code = code;
      existingAttempt.language = language;
      existingAttempt.reviewFeedback = reviewFeedback;
      existingAttempt.problemRating = problemRating;
      existingAttempt.problemTags = problemTags;
      attempt = await existingAttempt.save();
    } else {
      // Create new attempt
      attempt = new ProblemAttempt({
        user: req.user._id,
        problemId,
        contestId,
        problemIndex,
        problemName,
        problemTags,
        problemRating,
        solved: isSolved, // Use the converted boolean
        timeTaken,
        code,
        language,
        reviewFeedback
      });
      await attempt.save();
    }

    console.log('Attempt saved successfully. Solved:', attempt.solved);
    
    res.json({ 
      success: true,
      attempt 
    });
  } catch (error) {
    console.error('Error saving problem attempt:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: error.message 
    });
  }
};

// Bookmark a problem
exports.bookmarkProblem = async (req, res) => {
  try {
    const { contestId, problemIndex, problemName, problemTags, problemRating } = req.body;
    
    // Generate problemId from contestId and problemIndex
    const problemId = `${contestId}${problemIndex}`;
    
    // Check if already bookmarked
    const existingBookmark = await BookmarkedProblem.findOne({
      user: req.user._id,
      contestId,
      problemIndex
    });
    
    if (existingBookmark) {
      return res.status(400).json({ error: 'Problem already bookmarked' });
    }
    
    const bookmark = new BookmarkedProblem({
      user: req.user._id,
      problemId, // Add the generated problemId
      contestId,
      problemIndex,
      problemName,
      problemTags,
      problemRating
    });
    
    await bookmark.save();
    
    res.json({ 
      success: true,
      bookmark 
    });
  } catch (error) {
    console.error('Error bookmarking problem:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// Remove bookmark
exports.removeBookmark = async (req, res) => {
  try {
    const { contestId, problemIndex } = req.params;
    
    const result = await BookmarkedProblem.deleteOne({
      user: req.user._id,
      contestId,
      problemIndex
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's bookmarked problems
exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await BookmarkedProblem.find({ user: req.user._id }).sort({ bookmarkedAt: -1 });
    res.json({ bookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getRandomProblem = async (req, res) => {
  try {
    const { tags, rating } = req.query;
    
    if (!tags) {
      return res.status(400).json({ error: 'Tags parameter is required' });
    }
    
    const response = await axios.get(
      'https://codeforces.com/api/problemset.problems',
      {
        params: { tags }
      }
    );
    
    if (response.data.status !== 'OK') {
      return res.status(500).json({ error: 'Failed to fetch problems from Codeforces' });
    }
    
    let problems = response.data.result.problems;
    
    // Filter out problems without contestId and index
    let validProblems = problems.filter(problem => problem.contestId && problem.index);
    
    // Filter by rating if provided
    if (rating && rating !== 'undefined') {
      validProblems = validProblems.filter(problem => 
        problem.rating && problem.rating.toString() === rating.toString()
      );
      
      // If no problems found with exact rating, find closest rating
      if (validProblems.length === 0) {
        const ratingNum = parseInt(rating);
        validProblems = problems.filter(problem => 
          problem.rating && Math.abs(problem.rating - ratingNum) <= 200
        );
      }
    }
    
    if (validProblems.length === 0) {
      return res.status(404).json({ 
        error: 'No problems found with the selected criteria',
        suggestion: 'Try different tags or rating range'
      });
    }
    
    // Select a random problem
    const randomProblem = validProblems[Math.floor(Math.random() * validProblems.length)];
    
    // Construct problem URL
    randomProblem.url = `https://codeforces.com/problemset/problem/${randomProblem.contestId}/${randomProblem.index}`;
    
    res.json({ problem: randomProblem });
  } catch (error) {
    console.error('Error fetching random problem:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};