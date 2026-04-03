function calculateRating(upvoteCount, downvoteCount) {
  const total = upvoteCount + downvoteCount;
  if (total === 0) return 0;
  return Math.min(5, Math.max(0, (upvoteCount / total) * 5));
}

function calculateScore(upvoteCount, downvoteCount) {
  return upvoteCount - downvoteCount;
}

module.exports = { calculateRating, calculateScore };
