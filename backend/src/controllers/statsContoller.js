const ProblemAttempt = require('../models/ProblemAttempt');

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const attempts = await ProblemAttempt.find({ user: userId });
    const totalAttempts = attempts.length;
    const solvedProblems = attempts.filter(a => a.solved).length;
    const successRate = totalAttempts > 0 ? (solvedProblems / totalAttempts * 100).toFixed(2) : 0;
    
    // Calculate average time for solved problems
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
      const rating = attempt.problemRating;
      if (!problemsByRating[rating]) {
        problemsByRating[rating] = { attempted: 0, solved: 0 };
      }
      problemsByRating[rating].attempted++;
      if (attempt.solved) {
        problemsByRating[rating].solved++;
      }
    });

    // Recent activity
    const recentAttempts = await ProblemAttempt.find({ user: userId })
      .sort({ attemptDate: -1 })
      .limit(10)
      .select('problemName problemRating solved timeTaken attemptDate problemTags');

    res.json({
      stats: {
        totalAttempts,
        solvedProblems,
        successRate,
        avgTime: Math.round(avgTime)
      },
      byTag: problemsByTag,
      byRating: problemsByRating,
      recentAttempts
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSolvedProblems = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const solvedProblems = await ProblemAttempt.find({ 
      user: req.user._id, 
      solved: true 
    })
    .sort({ attemptDate: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('problemName problemRating timeTaken attemptDate problemTags contestId problemIndex language');
    
    const total = await ProblemAttempt.countDocuments({ 
      user: req.user._id, 
      solved: true 
    });
    
    res.json({
      solvedProblems,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalSolved: total
    });
  } catch (error) {
    console.error('Error fetching solved problems:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};