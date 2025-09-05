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
      if (attempt.problemTags && Array.isArray(attempt.problemTags)) {
        attempt.problemTags.forEach(tag => {
          if (!problemsByTag[tag]) {
            problemsByTag[tag] = { attempted: 0, solved: 0 };
          }
          problemsByTag[tag].attempted++;
          if (attempt.solved) {
            problemsByTag[tag].solved++;
          }
        });
      }
    });

    // Problems by rating with time statistics
    const problemsByRating = {};
    attempts.forEach(attempt => {
      if (attempt.problemRating) {
        const rating = attempt.problemRating;
        if (!problemsByRating[rating]) {
          problemsByRating[rating] = { 
            attempted: 0, 
            solved: 0,
            totalTime: 0,
            countWithTime: 0
          };
        }
        problemsByRating[rating].attempted++;
        if (attempt.solved) {
          problemsByRating[rating].solved++;
        }
        if (attempt.timeTaken) {
          problemsByRating[rating].totalTime += attempt.timeTaken;
          problemsByRating[rating].countWithTime++;
        }
      }
    });

    // Calculate average time for each rating
    const ratingWithAvgTime = {};
    Object.keys(problemsByRating).forEach(rating => {
      const data = problemsByRating[rating];
      ratingWithAvgTime[rating] = {
        attempted: data.attempted,
        solved: data.solved,
        avgTime: data.countWithTime > 0 ? (data.totalTime / data.countWithTime) : 0
      };
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
      byRating: ratingWithAvgTime, // Now includes average time
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
    .select('problemName problemRating timeTaken attemptDate problemTags contestId problemIndex language reviewFeedback');
    
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

// New: Get specific problem attempt with code and review
exports.getProblemAttempt = async (req, res) => {
  try {
    const { contestId, problemIndex } = req.params;
    
    const attempt = await ProblemAttempt.findOne({
      user: req.user._id,
      contestId,
      problemIndex
    }).select('problemName problemRating timeTaken attemptDate problemTags contestId problemIndex language reviewFeedback code');
    
    if (!attempt) {
      return res.status(404).json({ error: 'Problem attempt not found' });
    }
    
    res.json({ attempt });
  } catch (error) {
    console.error('Error fetching problem attempt:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// New: Get user's code for a specific problem
exports.getUserCode = async (req, res) => {
  try {
    const { contestId, problemIndex } = req.params;
    
    const attempt = await ProblemAttempt.findOne({
      user: req.user._id,
      contestId,
      problemIndex
    }).select('code language problemName');
    
    if (!attempt) {
      return res.status(404).json({ error: 'Code not found' });
    }
    
    res.json({ 
      code: attempt.code,
      language: attempt.language,
      problemName: attempt.problemName
    });
  } catch (error) {
    console.error('Error fetching user code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// New: Get AI review for a specific problem
exports.getAIReview = async (req, res) => {
  try {
    const { contestId, problemIndex } = req.params;
    
    const attempt = await ProblemAttempt.findOne({
      user: req.user._id,
      contestId,
      problemIndex
    }).select('reviewFeedback problemName timeTaken problemRating');
    
    if (!attempt) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    if (!attempt.reviewFeedback) {
      return res.status(404).json({ error: 'No AI review available for this problem' });
    }
    
    res.json({ 
      review: attempt.reviewFeedback,
      problemName: attempt.problemName,
      timeTaken: attempt.timeTaken,
      problemRating: attempt.problemRating
    });
  } catch (error) {
    console.error('Error fetching AI review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// New: Get statistics for charts and histograms
exports.getChartData = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all solved problems with rating and time
    const solvedProblems = await ProblemAttempt.find({ 
      user: userId, 
      solved: true,
      problemRating: { $exists: true, $ne: null }
    }).select('problemRating timeTaken');
    
    // Prepare data for rating histogram
    const ratingHistogram = {};
    solvedProblems.forEach(problem => {
      const rating = problem.problemRating;
      if (!ratingHistogram[rating]) {
        ratingHistogram[rating] = { count: 0, totalTime: 0 };
      }
      ratingHistogram[rating].count++;
      if (problem.timeTaken) {
        ratingHistogram[rating].totalTime += problem.timeTaken;
      }
    });
    
    // Calculate average time for each rating
    const chartData = Object.keys(ratingHistogram).map(rating => {
      const data = ratingHistogram[rating];
      return {
        rating: parseInt(rating),
        count: data.count,
        avgTime: data.count > 0 ? Math.round(data.totalTime / data.count) : 0
      };
    }).sort((a, b) => a.rating - b.rating);
    
    res.json({ chartData });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};