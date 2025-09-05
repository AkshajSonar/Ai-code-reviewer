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
  problemTags: {
    type: [String],
    required: true
  },
  problemRating: {
    type: Number,
    required: true
  },
  solved: {
    type: Boolean,
    default: false
  },
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  attemptDate: {
    type: Date,
    default: Date.now
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  reviewFeedback: {
    type: String
  }
}, {
  timestamps: true
});

ProblemAttemptSchema.index({ user: 1, contestId: 1, problemIndex: 1 }, { unique: true });

module.exports = mongoose.model('ProblemAttempt', ProblemAttemptSchema);