import mongoose from 'mongoose';

const BookmarkedProblemSchema = new mongoose.Schema({
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
  bookmarkedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient querying
BookmarkedProblemSchema.index({ user: 1, contestId: 1, problemIndex: 1 }, { unique: true });

export default mongoose.model('BookmarkedProblem', BookmarkedProblemSchema);