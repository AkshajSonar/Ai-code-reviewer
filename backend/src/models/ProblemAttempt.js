const mongoose = require('mongoose');

const ProblemAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: String,
    required: true
  },
  contestId: {
    type: String,
    required: true
  },
  problemIndex: {
    type: String,
    required: true
  },
  problemName: {
    type: String,
    required: true
  },
  problemTags: [String],
  problemRating: {
    type: Number
  },
  solved: {
    type: Boolean,
    default: false
  },
  timeTaken: {
    type: Number // in minutes
  },
  attemptDate: {
    type: Date,
    default: Date.now
  },
  code: {
    type: String
  },
  language: {
    type: String
  }
});

// Compound index for efficient querying
ProblemAttemptSchema.index({ user: 1, contestId: 1, problemIndex: 1 }, { unique: true });

module.exports = mongoose.model('ProblemAttempt', ProblemAttemptSchema);