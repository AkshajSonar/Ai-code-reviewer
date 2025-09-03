const ProblemAttempt = require('../models/ProblemAttempt');
const BookmarkedProblem = require('../models/BookmarkedProblem');

// Get user stats
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all attempts
    const attempts = await ProblemAttempt.find({ user: userId });
    
    // Calculate stats
    const totalAttempts = attempts.length;
    const solvedProblems = attempts.filter(a => a.solved).length;
    const successRate = totalAttempts > 0 ? (solvedProblems / totalAttempts * 100).toFixed(2) : 0;
    
    // Calculate average time taken for solved problems
    const solvedWithTime = attempts.filter(a => a.solved && a.timeTaken);
    const avgTime = solvedWithTime.length > 0 
      ? solvedWithTime.reduce((sum, a) => sum + a.timeTaken, 0) / solvedWithTime.length 
      : 0;
    
    // Problems by tag
    const problemsByTag = {};
    attempts.forEach(attempt => {
      attempt.problemTags.forEach(tag => {
        if (!problemsByTag[tag]) {
          problemsByTag[tag] = { attempted: 0, solved: 0 };
        }
        problemsByTag[tag].attempted++;
        if (attempt.solved) {
          problemsByTag[tag].solved++;
        }
      });
    });
    
    // Problems by rating
    const problemsByRating = {};
    attempts.forEach(attempt => {
      if (attempt.problemRating) {
        const rating = attempt.problemRating;
        if (!problemsByRating[rating]) {
          problemsByRating[rating] = { attempted: 0, solved: 0 };
        }
        problemsByRating[rating].attempted++;
        if (attempt.solved) {
          problemsByRating[rating].solved++;
        }
      }
    });
    
    // Recent activity
    const recentAttempts = await ProblemAttempt.find({ user: userId })
      .sort({ attemptDate: -1 })
      .limit(10);
    
    res.json({
      stats: {
        totalAttempts,
        solvedProblems,
        successRate,
        avgTime: Math.round(avgTime)
      },
      problemsByTag,
      problemsByRating,
      recentAttempts
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's problem attempts
exports.getUserAttempts = async (req, res) => {
  try {
    const { page = 1, limit = 20, solved } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { user: req.user._id };
    if (solved !== undefined) {
      query.solved = solved === 'true';
    }
    
    const attempts = await ProblemAttempt.find(query)
      .sort({ attemptDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await ProblemAttempt.countDocuments(query);
    
    res.json({
      attempts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalAttempts: total
    });
  } catch (error) {
    console.error('Error fetching user attempts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { defaultTags, difficultyRange } = req.body;
    
    const user = req.user;
    
    if (defaultTags) {
      user.preferences.defaultTags = defaultTags;
    }
    
    if (difficultyRange) {
      user.preferences.difficultyRange = {
        min: difficultyRange.min || user.preferences.difficultyRange.min,
        max: difficultyRange.max || user.preferences.difficultyRange.max
      };
    }
    
    await user.save();
    
    res.json({ preferences: user.preferences });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};